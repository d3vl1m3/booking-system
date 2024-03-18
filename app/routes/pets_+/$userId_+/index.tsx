import { useParams } from "@remix-run/react"

export default function Profile() {
    const {userId} = useParams()
    return (
        <div>
            <h1>{userId}&#39;s profile</h1>
            <p>{userId}</p>
        </div>
    )
} 