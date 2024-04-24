import { parseWithZod } from '@conform-to/zod'
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from '@remix-run/node'
import { useActionData, useLoaderData, useParams } from '@remix-run/react'
import { z } from 'zod'
import { petDetailsPage } from '~/routes'
import { UpdatePetModal } from '~/routes/pets+/components/modals/updatePetModal/updatePetModal'
import { validateCSRF } from '~/utils/csrf.server'
import { db, prisma, uploadImages } from '~/utils/db.server'
import { validateHoneypot } from '~/utils/honeypot.server'
import { invariantResponse } from '~/utils/misc'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.refine(file => file.size <= MAX_UPLOAD_SIZE, 'File is too large'),
	altText: z.string().max(50).optional(),
})

export const ImageFieldsetSchema = z.array(ImageSchema)

export const UpdatePetFormSchema = z.object({
	name: z.string().min(1),
	owner: z.string().min(1),
	images: ImageFieldsetSchema,
})

export async function loader({ params }: LoaderFunctionArgs) {
	const pet = await prisma.pet.findUnique({
		where: {
			id: params.petId,
		},
		select: {
			id: true,
			name: true,
			owners: true,
			images: {
				select: {
					id: true,
					blob: true,
					altText: true,
				},
			},
		},
	})

	invariantResponse(pet, 'No pet found')

	const owners = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
		},
	})

	return json({ pet, owners })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	await validateCSRF(formData, request.headers)
	await validateHoneypot(formData)

	const submission = parseWithZod(formData, {
		schema: UpdatePetFormSchema,
	})

	if (submission?.status !== 'success') {
		return json({ status: 'error', submission }, { status: 400 })
	}

	const { name, owner: ownerId, images } = submission.value

	const owner = db.user.findFirst({
		where: {
			id: {
				equals: ownerId,
			},
		},
	})

	invariantResponse(owner, 'Owner not found')

	const uploadedImages = await uploadImages(images)
	const pet = db.pet.create({
		name,
		owners: [owner],
		images: uploadedImages.filter(Boolean),
	})

	invariantResponse(pet, 'Failed to create pet', { status: 409 })

	return redirect(petDetailsPage(pet.id))
}

export default function UpdatePetRoute() {
	const { petId } = useParams()
	const { owners, pet } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()

	return (
		<UpdatePetModal
			actionData={actionData}
			onCloseRoute={petDetailsPage(petId ?? '')}
			owners={owners}
			pet={pet}
		/>
	)
}
