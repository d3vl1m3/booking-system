import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { petDetailsPage } from '~/routes'
import { DeletePetModal } from '~/routes/pets+/components/modals/deletePetModal/deletePetModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const pet = db.pet.findFirst({
		where: {
			id: {
				equals: params.petId,
			},
		},
	})

	invariantResponse(pet, 'Pet not found')

	return json({
		pet: {
			id: pet.id,
			name: pet.name,
		},
	})
}

export function action({ params }: ActionFunctionArgs) {
	const { petId } = params

	db.pet.delete({
		where: {
			id: {
				equals: petId,
			},
		},
	})

	return redirect('/pets')
}

export default function DeletePetRoute() {
	const { pet } = useLoaderData<typeof loader>()
	return <DeletePetModal pet={pet} onCloseRoute={petDetailsPage(pet.id)} />
}
