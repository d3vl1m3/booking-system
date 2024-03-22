import { Form } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

export const AddUserModal = () => {
	return (
		<RouteBasedModal>
			<h1>Add User</h1>
			<Form method="POST">
				<div>
					<label htmlFor="name">Name: </label>
					<input type="text" name="name" id="name" />
				</div>
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
