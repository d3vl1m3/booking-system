import { Form, Path } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Owner = {
	id: string
	name: string
}

type Errors = {
	fieldErrors: {
		name?: string[]
		ownerId?: string[]
	}
	formErrors: string[]
}

const useHydrate = () => {
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		setHydrated(true)
	}, [])

	return { hydrated }
}

export const AddPetModal = ({
	owners,
	onCloseRoute,
	errors,
}: {
	owners: Owner[]
	onCloseRoute: string | Partial<Path>
	errors?: Errors
}) => {
	const { hydrated } = useHydrate()

	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Add Pet</h1>
			<Form method="POST" noValidate={hydrated}>
				<div>
					<label
						htmlFor="name"
						aria-invalid={errors?.fieldErrors?.name ? true : undefined}
						aria-describedby={
							errors?.fieldErrors?.name ? 'name-errors' : undefined
						}
					>
						Name:{' '}
					</label>
					<input type="text" name="name" id="name" required />
					<br />
					{errors?.fieldErrors.name?.length ? (
						<div>
							<span className="text-red-600" id="name-errors">
								{errors.fieldErrors.name[0]}
							</span>
						</div>
					) : null}
				</div>
				<div>
					<label htmlFor="owner">Owner: </label>
					<select name="owner" id="owner" required>
						{owners.map(owner => (
							<option key={owner.id} value={owner.id}>
								{owner.name}
							</option>
						))}
					</select>
				</div>
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
