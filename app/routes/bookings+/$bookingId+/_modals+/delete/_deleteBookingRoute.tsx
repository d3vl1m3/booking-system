import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { bookingDetailsPage, bookingsListPage } from '~/routes'
import { DeleteBookingModal } from '~/routes/bookings+/components/modals/deleteBookingModal/deleteBookingModal'
import { prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const booking = await prisma.booking.findUnique({
		where: {
			id: params.bookingId,
		},
		select: {
			id: true,
		},
	})

	invariantResponse(booking, 'booking not found')

	return json({ booking })
}

export async function action({ params }: ActionFunctionArgs) {
	const { bookingId } = params

	await prisma.booking.delete({
		where: {
			id: bookingId,
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
