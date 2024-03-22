import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type Pet = {
	id: string
	name: string
}

type DeletePetModalProps = {
	pet: Pet
}

export const DeletePetModal = ({ pet }: DeletePetModalProps) => {
	return (
		<RouteBasedModal>
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
