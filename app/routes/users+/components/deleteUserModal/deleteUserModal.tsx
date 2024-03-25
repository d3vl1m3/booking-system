import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type DeleteUserModalProps = {
	name: string
	onCloseRoute: string | Partial<Path>
}

export const DeleteUserModal = ({
	name,
	onCloseRoute,
}: DeleteUserModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
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
