import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Owner = {
	id: string
	name: string
}

export const AddPetModal = ({
	owners,
	onCloseRoute,
}: {
	owners: Owner[]
	onCloseRoute: string | Partial<Path>
}) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Add Pet</h1>
			<Form method="POST">
				<div>
					<label htmlFor="name">Name: </label>
					<input type="text" name="name" id="name" />
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
