import {
	Link,
	Outlet,
	json,
	useLoaderData,
	useNavigation,
} from '@remix-run/react'
import {
	addBookingModalBookingsListPage,
	bookingDetailsPage,
	bookingsListPage,
} from '~/routes'
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
	const navigation = useNavigation()

	const isPending =
		navigation.state !== 'idle' &&
		navigation.location.pathname === bookingsListPage

	if (isPending) {
		// todo: loading spinner
		return '...loading'
	}

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
					<thead>
						<tr>
							<th dir="col">Booking ref</th>
							<th dir="col">Pets booked</th>
							<th dir="col">Date start</th>
							<th dir="col">Date end</th>
						</tr>
					</thead>
					<tbody>
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
					</tbody>
				</table>
			) : (
				'No Bookings'
			)}
			<Outlet />
		</>
	)
}
