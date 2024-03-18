import { Link, useParams } from "@remix-run/react"

export default function ProfileDetailsPage() {
    const {userId} = useParams()
    return <div>

        <h1>{userId}&#39;s profile</h1>
        <p><Link to="./..">Back to Users List</Link></p>
        <p>{userId}</p>
    </div>
} 