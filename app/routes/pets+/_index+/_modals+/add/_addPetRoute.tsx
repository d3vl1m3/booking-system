import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { petDetailsPage, petsListPage } from '~/routes'
import { AddPetModal } from '~/routes/pets+/components/modals/addPetModal/addPetModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

const AddPetFormSchema = z.object({
	name: z.string().min(1),
	ownerId: z.string().min(1),
})

export function loader() {
	const owners = db.user
		.getAll()
		.map(({ id, name, username }) => ({ id, name, username }))

	return json({ owners })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const result = AddPetFormSchema.safeParse({
		name: formData.get('name'),
		ownerId: formData.get('owner'),
	})

	if (!result.success) {
		return json(
			{ status: 'error', errors: result.error.flatten() },
			{ status: 400 },
		)
	}

	const { name, ownerId } = result.data

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

	return redirect(petDetailsPage(pet.id))
}

export default function AddPetRoute() {
	const { owners } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()

	return (
		<AddPetModal
			owners={owners}
			onCloseRoute={petsListPage}
			errors={actionData?.errors}
		/>
	)
}
