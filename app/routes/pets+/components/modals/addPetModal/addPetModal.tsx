import { Form } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'
import { type Owner } from '~/routes/pets+/_index+/_modals+/add/_addPetRoute'

export const AddPetModal = ({ owners }: { owners: Owner[] }) => {
	return (
		<RouteBasedModal>
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
