import { Link, useParams } from "@remix-run/react"

export default function BookingDetailsPage() {
    const {bookingId} = useParams()
    return (
        <>
            <h1>Booking #{bookingId}</h1>
            <p><Link to="./..">Back to Bookings Page</Link></p>
            <p>{bookingId}</p>
        </>
    )
} 