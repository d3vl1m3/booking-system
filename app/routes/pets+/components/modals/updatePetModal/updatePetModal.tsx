import {
	getFormProps,
	useForm,
	getInputProps,
	getSelectProps,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { pt_BR } from '@faker-js/faker'
import { SerializeFrom } from '@remix-run/node'
import { Form, Path } from '@remix-run/react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { ImageChooser } from '~/components/imageChooser/imageChooser'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'
import {
	UpdatePetFormSchema,
	action,
} from '~/routes/pets+/$petId+/_modals+/update/_updatePetRoute'

type Owner = {
	id: string
	name: string
}

type UpdatePetModalProps = {
	actionData: SerializeFrom<typeof action> | undefined
	owners: Owner[]
	onCloseRoute: string | Partial<Path>
	pet: {
		id: string
		name: string
		owners: Owner[]
		images: {
			id: string
			altText: string
			blob: { type: 'Buffer'; data: number[] }
		}[]
	}
}

const ErrorList = ({
	id,
	errors,
}: {
	id?: string
	errors?: Array<string> | null
}) =>
	errors?.length ? (
		<ul id={id} className="flex flex-col gap-1">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null

export const UpdatePetModal = ({
	pet,
	actionData,
	onCloseRoute,
	owners,
}: UpdatePetModalProps) => {
	const [form, fields] = useForm({
		id: 'update-pet-form',
		constraint: getZodConstraint(UpdatePetFormSchema),
		lastResult: actionData?.submission.payload,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpdatePetFormSchema })
		},
		defaultValue: {
			name: pet.name,
			owner: pet.owners[0].id,
			images: pet.images,
		},
	})

	const formProps = getFormProps(form)
	const nameFieldProps = getInputProps(fields.name, {
		type: 'text',
	})
	const ownerFieldProps = getSelectProps(fields.owner)
	const imagesFieldList = fields.images.getFieldList()

	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Update Pet</h1>
			<Form method="POST" {...formProps} encType="multipart/form-data">
				<button className="hidden" type="submit" aria-hidden />
				<HoneypotInputs />
				<AuthenticityTokenInput />
				<div>
					<label htmlFor={nameFieldProps.id}>Name: </label>
					<input {...nameFieldProps} />
					<br />
					<ErrorList id={nameFieldProps.id} errors={fields.name.errors} />
				</div>
				<div>
					{imagesFieldList.map((imageField, index) => {
						return (
							<>
								<button
									className="btn btn-danger"
									{...form.remove.getButtonProps({
										name: fields.images.name,
										index,
									})}
								>
									<span className="sr-only">Delete image</span>
									<span aria-hidden>❌</span>
								</button>
								<ImageChooser config={imageField} />
							</>
						)
					})}
					<button
						className="btn"
						{...form.insert.getButtonProps({
							name: fields.images.name,
						})}
					>
						<span>➕ Add image</span>
					</button>
				</div>
				<div>
					<label htmlFor={ownerFieldProps.id}>Owner: </label>
					<select {...ownerFieldProps}>
						{owners.map(owner => (
							<option key={owner.id} value={owner.id}>
								{owner.name}
							</option>
						))}
					</select>
					<ErrorList id={ownerFieldProps.id} errors={fields.owner.errors} />
				</div>
				<button type="submit" className="btn">
					Save
				</button>
				<ErrorList id={formProps.id} errors={form.errors} />
			</Form>
		</RouteBasedModal>
	)
}
