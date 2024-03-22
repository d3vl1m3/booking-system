import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useFormAction, useLoaderData } from '@remix-run/react'
import { UpdatePetModal } from '~/routes/pets+/components/modals/updatePetModal/updatePetModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const { petId } = params

	const pet = db.pet.findFirst({
		where: {
			id: {
				equals: petId,
			},
		},
	})

	const owners = db.user.getAll().map(({ name, id }) => ({ name, id }))

	invariantResponse(pet, 'Pet not found')
	invariantResponse(owners, 'Owners not found')

	return json({
		pet: {
			name: pet.name,
			owners: pet.owners,
		},
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
		/>
	)
}
