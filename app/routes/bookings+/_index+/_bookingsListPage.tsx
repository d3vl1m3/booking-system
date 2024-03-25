import { Link, Outlet, json, useLoaderData } from '@remix-run/react'
import { addBookingModalBookingsListPage, bookingDetailsPage } from '~/routes'
import { db } from '~/utils/db.server'

export function loader() {
	const bookings = db.booking
		.getAll()
		.map(({ id, bookingRefrence, dateEnd, dateStart, pets }) => ({
			id,
			bookingRefrence,
			dateEnd,
			dateStart,
			pets,
		}))

	return json({
		bookings,
	})
}

export default function BookingsListPage() {
	const { bookings } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>Bookings</h1>
			<ul>
				<li>
					<Link to={addBookingModalBookingsListPage}>Add booking</Link>
				</li>
			</ul>
			{bookings.length ? (
				<table>
					<tr>
						<th>Booking ref</th>
						<th>Pets booked</th>
						<th>Date start</th>
						<th>Date end</th>
					</tr>
					{bookings.map(booking => (
						<tr key={booking.id}>
							<td>
								<Link to={`${bookingDetailsPage(booking.id)}`}>
									{booking.bookingRefrence}
								</Link>
							</td>
							<td>{booking.pets.map(({ name }) => name).join(', ')}</td>
							<td>{booking.dateStart}</td>
							<td>{booking.dateEnd}</td>
						</tr>
					))}
				</table>
			) : (
				'No Bookings'
			)}
			<Outlet />
		</>
	)
}
