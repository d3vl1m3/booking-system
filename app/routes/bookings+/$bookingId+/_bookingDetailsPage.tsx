import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import {
	bookingsListPage,
	petDetailsPage,
	updateBookingModalBookingDetailsPage,
} from '~/routes'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const booking = db.booking.findFirst({
		where: {
			id: {
				equals: params.bookingId,
			},
		},
	})

	invariantResponse(booking, 'Pet not found', { status: 404 })

	return json({
		booking: {
			id: booking.id,
			bookingRefrence: booking.bookingRefrence,
			dateEnd: booking.dateEnd,
			dateStart: booking.dateStart,
			pets: booking.pets,
			cancelled: booking.cancelled,
		},
	})
}

export default function BookingDetailsPage() {
	const { booking } = useLoaderData<typeof loader>()
	return (
		<>
			<h1>Booking #{booking.bookingRefrence}</h1>

			<p>
				<span>{booking.cancelled ? 'Cancelled' : 'Active'}</span>
			</p>

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
							{booking.pets.length ? (
								<ul>
									{booking.pets.map(pet => (
										<li key={pet.id}>
											<Link to={petDetailsPage(pet.id)}>{pet.name}</Link>
										</li>
									))}
								</ul>
							) : (
								'No pets booked'
							)}
						</td>
					</tr>
				</tbody>
			</table>
			<Outlet />
		</>
	)
}
