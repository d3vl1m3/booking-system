import { parseWithZod } from '@conform-to/zod'
import {
	ActionFunctionArgs,
	json,
	redirect,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { petDetailsPage, petsListPage } from '~/routes'
import { AddPetModal } from '~/routes/pets+/components/modals/addPetModal/addPetModal'
import { db, uploadImages } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const AddPetFormSchema = z.object({
	name: z.string().min(1),
	owner: z.string().min(1),
	file: z
		.instanceof(File)
		.refine(file => file.size <= MAX_UPLOAD_SIZE, 'File is too large'),
})

export function loader() {
	const owners = db.user
		.getAll()
		.map(({ id, name, username }) => ({ id, name, username }))

	return json({ owners })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	const submission = parseWithZod(formData, {
		schema: AddPetFormSchema,
	})

	if (submission?.status !== 'success') {
		return json({ status: 'error', submission }, { status: 400 })
	}

	const { name, owner: ownerId, file } = submission.value

	const owner = db.user.findFirst({
		where: {
			id: {
				equals: ownerId,
			},
		},
	})

	invariantResponse(owner, 'Owner not found')

	const images = await uploadImages([{ file }])
	const pet = db.pet.create({
		name,
		owners: [owner],
		images: images.filter(Boolean),
	})

	invariantResponse(pet, 'Failed to create pet', { status: 409 })

	return redirect(petDetailsPage(pet.id))
}

export default function AddPetRoute() {
	const { owners } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()

	return (
		<AddPetModal
			actionData={actionData}
			owners={owners}
			onCloseRoute={petsListPage}
		/>
	)
}
