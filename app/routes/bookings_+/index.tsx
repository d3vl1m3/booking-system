import { Link, json, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";


export function loader() {
    const bookings = db.booking.getAll().map(({
        id,
        bookedBy,
        dateEnd, 
        dateStart, 
        pets
    }) => ({
        id,
        bookedBy,
        dateEnd, 
        dateStart, 
        pets
    }))
    
    return json({
        bookings
    })

}

export default function BookingsListPage() {
    const { bookings } = useLoaderData<typeof loader>()
    
    return (
        <>
            <h1>Bookings</h1>
            {bookings.length ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            <Link to={`./${booking.id}`}>
                                {`${booking.bookedBy?.name} (${booking.dateStart} to ${booking.dateEnd})`}
                            </Link>
                        </li>

                    ))}
                </ul>
            ) : ('No Bookings')}
        </>
    )
}