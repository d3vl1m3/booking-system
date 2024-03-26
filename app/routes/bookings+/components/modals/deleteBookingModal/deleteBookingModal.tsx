import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type DeleteUserModalProps = {
	bookingId: string
	onCloseRoute: string | Partial<Path>
}

export const DeleteBookingModal = ({
	bookingId,
	onCloseRoute,
}: DeleteUserModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Delete booking: {bookingId}</h1>
			<p>You are about to delete the booking "{bookingId}"</p>
			<p>This step cannot be undone</p>
			<Form method="POST">
				<button type="submit" className="btn">
					Delete
				</button>
			</Form>
		</RouteBasedModal>
	)
}
