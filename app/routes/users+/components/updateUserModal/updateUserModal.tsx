import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type UpdateModalProps = {
	name: string
	onCloseRoute: string | Partial<Path>
}

export const UpdateUserModal = ({ name, onCloseRoute }: UpdateModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Update User</h1>
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
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
