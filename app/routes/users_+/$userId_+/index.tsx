import { Link, useLoaderData } from "@remix-run/react"

import { db } from 'app/utils/db.server'
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { invariantResponse } from "../misc";
import { GeneralErrorBoundary } from "~/routes/components/generalErrorBoundary";

export async function loader({ params }: LoaderFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			id: {
				equals: params.userId,
			},
		},
	})
	invariantResponse(user, 'User not found', { status: 404 })

	return json({
		user: { name: user.name, username: user.username, id: user.id },        
	})
}

export default function UserDetailsPage() {
    const {user} = useLoaderData<typeof loader>()

    return <div>
        <h1>{user.name}&#39;s profile</h1>
        <p><Link to="./..">Back to Users List</Link></p>
        <p>User ID: {user.id}</p>
        <p>User name: {user.username}</p>
    </div>
} 

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the ID &quot;{params.userId}&quot; exists</p>
				),
			}}
		/>
	)
}
