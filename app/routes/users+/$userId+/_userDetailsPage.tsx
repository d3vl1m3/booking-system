import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { invariantResponse } from '~/utils/misc'
import {
	deleteUserModalUserDetailsPage,
	petDetailsPage,
	updateUserModalUserDetailsPage,
	usersListPage,
} from '~/routes'
import { GeneralErrorBoundary } from '~/components/generalErrorBoundary/generalErrorBoundary'

export async function loader({ params }: LoaderFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			id: {
				equals: params.userId,
			},
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	const pets = db.pet.findMany({
		where: {
			owners: {
				id: {
					contains: user.id,
				},
			},
		},
	})

	return json({
		user: {
			name: user.name,
			username: user.username,
			id: user.id,
			pets,
		},
	})
}

export default function UserDetailsPage() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>{user.name}&#39;s profile</h1>
			<p>
				<Link to={usersListPage}>Back to Users List</Link>
			</p>
			<ul>
				<li>
					<Link to={updateUserModalUserDetailsPage(user.id)}>Update User</Link>
				</li>
				<li>
					<Link to={deleteUserModalUserDetailsPage(user.id)}>Delete User</Link>
				</li>
			</ul>
			<p>User ID: {user.id}</p>
			<p>User name: {user.username}</p>

			<div>
				Pets:{' '}
				{user.pets ? (
					<ul>
						{user.pets.map(pet => (
							<li key={pet.id}>
								<Link to={petDetailsPage(pet.id)}>{pet.name}</Link>
							</li>
						))}
					</ul>
				) : (
					'No pets'
				)}
			</div>
			<Outlet />
		</>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username &quot;{params.username}&quot; exists</p>
				),
			}}
		/>
	)
}
