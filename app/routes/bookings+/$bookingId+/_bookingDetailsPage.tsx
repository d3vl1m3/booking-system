import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import { invariantResponse } from "~/utils/misc"

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
            bookedBy: booking.bookedBy,
            bookingRefrence: booking.bookingRefrence,
            dateEnd: booking.dateEnd, 
            dateStart: booking.dateStart, 
            pets: booking.pets
		},        
	})
}

export default function BookingDetailsPage() {
    const {booking} = useLoaderData<typeof loader>()
    return (
        <>
            <h1>Booking #{booking.bookingRefrence}</h1>
            <p><Link to="./..">Back to Bookings Page</Link></p>
            <table>
                <tbody>
                    <tr>
                        <th align="left" dir="row">
                            Booked By
                        </th>
                        <td>{booking.bookedBy?.name}</td>
                    </tr>
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
                                    {booking.pets.map((pet) => (
                                        <li key={pet.id}>
                                            <Link to={`pets/${pet.id}`}>
                                                {pet.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                            ) : 'No pets booked'}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
} 