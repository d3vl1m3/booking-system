import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { db } from 'app/utils/db.server'
import { json } from '@remix-run/node'
import { addUserModalUsersListPage, userDetailsPage } from '~/routes'

type User = {
	id: string
	name: string | null
	username: string
}

export async function loader() {
	const users: User[] = db.user
		.getAll()
		.map(({ id, name, username }) => ({ id, name, username }))
	return json({ users })
}

export default function UsersListPage() {
	const { users }: { users: User[] } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>List page</h1>
			<ul>
				<li>
					<Link to={addUserModalUsersListPage}>Add User</Link>
				</li>
			</ul>
			<ul>
				{users.map(user => (
					<li key={user.id}>
						<Link to={userDetailsPage(user.id)}>{user.name}</Link>
					</li>
				))}
			</ul>
			<Outlet />
		</>
	)
}
