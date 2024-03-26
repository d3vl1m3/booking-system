import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

export const AddUserModal = ({
	onCloseRoute,
}: {
	onCloseRoute: string | Partial<Path>
}) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
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
