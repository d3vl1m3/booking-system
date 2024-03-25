import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type Owner = {
	id: string
	name: string
}

type UpdateModalProps = {
	name: string
	owner: Owner
	ownerOptions: Owner[]
	onCloseRoute: string | Partial<Path>
}

export const UpdatePetModal = ({
	name,
	owner,
	ownerOptions,
	onCloseRoute,
}: UpdateModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Update Pet</h1>
			<Form method="POST">
				<div>
					<label htmlFor="name">Name: </label>
					<input
						type="text"
						name="name"
						id="name"
						defaultValue={name}
						required
					/>
				</div>
				<div>
					<label htmlFor="owner">Owner: </label>
					<select name="owner" id="owner" defaultValue={owner.id} required>
						{ownerOptions.map(o => (
							<option key={o.id} value={o.id}>
								{o.name}
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
