import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import {
	bookingsListPage,
	petDetailsPage,
	updateBookingModalBookingDetailsPage,
} from '~/routes'
import { prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const booking = await prisma.booking.findUnique({
		where: {
			id: params.bookingId,
		},
		select: {
			id: true,
			bookingRefrence: true,
			dateStart: true,
			dateEnd: true,
			pet: true,
		},
	})

	invariantResponse(booking, 'Pet not found', { status: 404 })

	return json({ booking })
}

export default function BookingDetailsPage() {
	const { booking } = useLoaderData<typeof loader>()
	return (
		<>
			<h1>Booking #{booking.bookingRefrence}</h1>

			<ul>
				<li>
					<Link to={bookingsListPage}>Back to Bookings Page</Link>
				</li>
				<li>
					<Link to={updateBookingModalBookingDetailsPage(booking.id)}>
						Update booking
					</Link>
				</li>
			</ul>
			<p></p>
			<table>
				<tbody>
					<tr>
						<th align="left" dir="row">
							Date booked for
						</th>
						<td>{booking.dateStart}</td>
					</tr>
					<tr>
						<th align="left" dir="row">
							Booking ends
						</th>
						<td>{booking.dateEnd}</td>
					</tr>
					<tr>
						<th align="left" dir="row">
							Pets booked
						</th>
						<td>
							<Link to={petDetailsPage(booking.pet.id)}>
								{booking.pet.name}
							</Link>
						</td>
					</tr>
				</tbody>
			</table>
			<Outlet />
		</>
	)
}
