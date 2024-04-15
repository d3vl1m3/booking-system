import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { petDetailsPage, petsListPage } from '~/routes'
import { DeletePetModal } from '~/routes/pets+/components/modals/deletePetModal/deletePetModal'
import { prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const pet = await prisma.pet.findFirst({
		where: {
			id: params.petId,
		},
		select: {
			id: true,
			name: true,
		},
	})

	invariantResponse(pet, 'Pet not found')

	return json({ pet })
}

export function action({ params }: ActionFunctionArgs) {
	const { petId } = params

	prisma.pet.delete({
		where: {
			id: petId,
		},
	})

	return redirect(petsListPage)
}

export default function DeletePetRoute() {
	const { pet } = useLoaderData<typeof loader>()
	return <DeletePetModal pet={pet} onCloseRoute={petDetailsPage(pet.id)} />
}
