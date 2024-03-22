import { Form } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type DeleteUserModalProps = {
	name: string
}

export const DeleteUserModal = ({ name }: DeleteUserModalProps) => {
	return (
		<RouteBasedModal>
			<h1>Delete {name}</h1>
			<p>You are about to remove the user named "{name}" from the system</p>
			<p>This step cannot be undone</p>
			<Form method="POST">
				<button type="submit" className="btn">
					Delete
				</button>
			</Form>
		</RouteBasedModal>
	)
}
