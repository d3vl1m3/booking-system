import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { petDetailsPage } from '~/routes'
import { UpdatePetModal } from '~/routes/pets+/components/modals/updatePetModal/updatePetModal'
import { prisma, db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const { petId } = params

	const pet = await prisma.pet.findFirst({
		where: {
			id: petId,
		},
		select: {
			id: true,
			name: true,
			owners: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	})

	invariantResponse(pet, `Pet not found: ${petId}`)

	const owners = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
		},
	})

	invariantResponse(owners, 'Owners not found')

	return json({
		pet,
		owners,
	})
}

export async function action({ params, request }: ActionFunctionArgs) {
	const { petId } = params

	const formData = await request.formData()
	const name = formData.get('name')
	const ownerId = formData.get('owner')

	invariantResponse(typeof name === 'string', 'Invalid name value')
	invariantResponse(typeof ownerId === 'string', 'Invalid owner value')
	invariantResponse(name, 'Name cannot be blank')
	invariantResponse(ownerId, 'Owner field cannot be empty')

	const owner = db.user.findFirst({
		where: {
			id: {
				equals: ownerId,
			},
		},
	})

	invariantResponse(owner, 'Owner not found')

	db.pet.update({
		where: {
			id: {
				equals: petId,
			},
		},
		data: {
			name,
			owners: [owner],
		},
	})

	return redirect(`/pets/${petId}`)
}

export default function UpdatePetRoute() {
	const { pet, owners } = useLoaderData<typeof loader>()

	return (
		<UpdatePetModal
			name={pet.name}
			owner={pet.owners?.[0]}
			ownerOptions={owners}
			onCloseRoute={petDetailsPage(pet.id)}
		/>
	)
}
