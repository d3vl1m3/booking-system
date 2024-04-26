import { parseWithZod } from '@conform-to/zod'
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from '@remix-run/node'

import { createId as cuid } from '@paralleldrive/cuid2'
import { useActionData, useLoaderData, useParams } from '@remix-run/react'
import { z } from 'zod'
import { petDetailsPage } from '~/routes'
import { UpdatePetModal } from '~/routes/pets+/components/modals/updatePetModal/updatePetModal'
import { validateCSRF } from '~/utils/csrf.server'
import { prisma } from '~/utils/db.server'
import { validateHoneypot } from '~/utils/honeypot.server'
import { invariantResponse } from '~/utils/misc'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine(file => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
})

export const UpdatePetFormSchema = z.object({
	name: z.string().min(1),
	owner: z.string().min(1),
	images: z.array(ImageFieldsetSchema),
})

type ImageFieldset = z.infer<typeof ImageFieldsetSchema>

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
	return image.id != null
}

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

export async function action({ request, params }: ActionFunctionArgs) {
	const { petId = '' } = params
	const formData = await unstable_parseMultipartFormData(
		request,
		unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	await validateCSRF(formData, request.headers)
	await validateHoneypot(formData)

	const submission = await parseWithZod(formData, {
		async: true,
		schema: UpdatePetFormSchema.transform(async ({ images = [], ...data }) => {
			return {
				...data,
				imageUpdates: await Promise.all(
					images.filter(imageHasId).map(async i => {
						if (imageHasFile(i)) {
							return {
								id: i.id,
								altText: i.altText,
								contentType: i.file.type,
								blob: Buffer.from(await i.file.arrayBuffer()),
							}
						} else {
							return { id: i.id, altText: i.altText }
						}
					}),
				),
				newImages: await Promise.all(
					images
						.filter(imageHasFile)
						.filter(i => !i.id)
						.map(async image => {
							return {
								altText: image.altText ?? '',
								contentType: image.file.type,
								blob: Buffer.from(await image.file.arrayBuffer()),
							}
						}),
				),
			}
		}),
	})

	if (submission?.status !== 'success') {
		return json({ status: 'error', submission }, { status: 400 })
	}

	const { name, owner: ownerId, imageUpdates, newImages } = submission.value

	// Update basic Pet info
	await prisma.pet.update({
		where: {
			id: petId,
		},
		data: {
			name,
			owners: {
				set: [{ id: ownerId }],
			},
			images: {
				deleteMany: {
					id: { notIn: imageUpdates.map(i => i.id) },
				},
				updateMany: imageUpdates.map(updates => ({
					where: { id: updates.id },
					data: { ...updates, id: updates.blob ? cuid() : updates.id },
				})),
				createMany: {
					data: newImages,
				},
			},
		},
	})

	return redirect(petDetailsPage(petId))
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
