import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Pet = {
	id: string
	name: string
}

type DeletePetModalProps = {
	pet: Pet
	onCloseRoute: string | Partial<Path>
}

export const DeletePetModal = ({ pet, onCloseRoute }: DeletePetModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Delete {pet.name}</h1>
			<p>You are about to remove the pet named "{pet.name}" from the system</p>
			<p>This step cannot be undone</p>
			<Form method="POST">
				<button type="submit" className="btn">
					Delete
				</button>
			</Form>
		</RouteBasedModal>
	)
}
