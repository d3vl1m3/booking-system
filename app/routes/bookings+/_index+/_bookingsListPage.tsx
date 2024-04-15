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
	petDetailsPage,
} from '~/routes'
import { db, prisma } from '~/utils/db.server'

export async function loader() {
	const bookings = await prisma.booking.findMany({
		select: {
			id: true,
			bookingRefrence: true,
			dateEnd: true,
			dateStart: true,
			pet: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	})

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
								<td>
									<Link to={`${petDetailsPage(booking.id)}`}>
										{booking.pet.name}
									</Link>
								</td>
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
