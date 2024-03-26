import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { bookingDetailsPage, bookingsListPage } from '~/routes'
import { DeleteBookingModal } from '~/routes/bookings+/components/modals/deleteBookingModal/deleteBookingModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const user = db.booking.findFirst({
		where: {
			id: {
				equals: params.bookingId,
			},
		},
	})

	invariantResponse(user, 'User not found')

	return json({
		booking: {
			id: user.id,
		},
	})
}

export function action({ params }: ActionFunctionArgs) {
	const { bookingId } = params

	db.booking.update({
		where: {
			id: {
				equals: bookingId,
			},
		},
		data: {
			cancelled: true,
		},
	})

	return redirect(bookingsListPage)
}

export default function DeleteUserRoute() {
	const { booking } = useLoaderData<typeof loader>()
	return (
		<DeleteBookingModal
			bookingId={booking.id}
			onCloseRoute={bookingDetailsPage(booking.id)}
		/>
	)
}
