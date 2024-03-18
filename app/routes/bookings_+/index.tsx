import { Link } from "@remix-run/react";

export default function BookingsListPage() {
    return <>
        <h1>Bookings</h1>
        <ul>
            <li>
                <Link to="./1">Booking 1</Link>
            </li>
            <li>
                <Link to="./2">Booking 2</Link>
            </li>
            <li>
                <Link to="./3">Booking 3</Link>
            </li>
            <li>
                <Link to="./4">Booking 4</Link>
            </li>
        </ul>
    </>
}