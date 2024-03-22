import { Form } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type UpdateModalProps = {
	name: string
}

export const UpdateUserModal = ({ name }: UpdateModalProps) => {
	return (
		<RouteBasedModal>
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
