import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { AddPetModal } from '~/routes/pets+/components/modals/addPetModal/addPetModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export type Owner = {
	id: string
	name: string | null
}

export function loader() {
	const owners = db.user
		.getAll()
		.map(({ id, name, username }) => ({ id, name, username }))

	return json({ owners })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const formNameValue = formData.get('name')
	const name = typeof formNameValue === 'string' ? formNameValue : undefined
	const ownerId = formData.get('owner')

	invariantResponse(name, 'Pet name required', { status: 422 })

	invariantResponse(
		typeof name === 'string',
		`Pet name has invlaid value: ${typeof name !== 'string'}`,
		{ status: 422 },
	)

	invariantResponse(
		typeof ownerId === 'string',
		`Owner ID has invlaid value: ${typeof ownerId !== 'string'}`,
		{ status: 422 },
	)

	invariantResponse(ownerId, 'Owner ID required', { status: 422 })

	const owner =
		typeof ownerId === 'string'
			? db.user.findFirst({
					where: {
						id: {
							equals: ownerId,
						},
					},
			  })
			: null

	invariantResponse(owner, 'Owner not found')

	const pet = db.pet.create({
		name,
		owners: [owner],
	})

	invariantResponse(pet, 'Failed to create pet', { status: 409 })

	return redirect('/pets')
}

export default function AddPetRoute() {
	const { owners }: { owners: Owner[] } = useLoaderData<typeof loader>()

	return <AddPetModal owners={owners} />
}
