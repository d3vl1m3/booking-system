import { Form, Path } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Owner = {
	id: string
	name: string
}

const useHydrate = () => {
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		setHydrated(true)
	}, [])

	return { hydrated }
}

function ErrorList({
	id,
	errors,
}: {
	id?: string
	errors?: Array<string> | null
}) {
	return errors?.length ? (
		<ul id={id} className="flex flex-col gap-1">
			{errors.map((error, i) => (
				<li key={i} className="text-[10px] text-foreground-destructive">
					{error}
				</li>
			))}
		</ul>
	) : null
}

export const AddPetModal = ({
	fieldErrors,
	onCloseRoute,
	owners,
}: {
	formErrors: string[] | null | undefined
	fieldErrors:
		| {
				name?: string[]
				owner?: string[]
		  }
		| null
		| undefined
	owners: Owner[]
	onCloseRoute: string | Partial<Path>
}) => {
	const { hydrated } = useHydrate()

	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Add Pet</h1>
			<Form method="POST" noValidate={hydrated}>
				<div>
					<label
						htmlFor="name"
						aria-invalid={fieldErrors?.name ? true : undefined}
						aria-describedby={fieldErrors?.name ? 'name-errors' : undefined}
					>
						Name:{' '}
					</label>
					<input type="text" name="name" id="name" required />
					<br />
					<ErrorList errors={fieldErrors?.name} />
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
					<ErrorList errors={fieldErrors?.owner} />
				</div>
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
