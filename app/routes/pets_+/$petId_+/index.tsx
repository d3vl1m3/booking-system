import { Link, useParams } from "@remix-run/react"

export default function Profile() {
    const {petId} = useParams()
    return <div>
        <h1>{petId}&#39;s details</h1>
        <p><Link to="./..">Back to Pets List</Link></p>
        <p>Pet ID: {petId}</p>
    </div>
} 