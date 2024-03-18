import { Link, useLoaderData } from "@remix-run/react";

import { db } from 'app/utils/db.server'
import { json } from "@remix-run/node";


export async function loader() {
	const users = db.user
        .getAll()
		.map(({ id, name, username }) => ({ id, name, username}))
	return json({ users })
}

export default function UsersListPage() {
	const { users } = useLoaderData<typeof loader>()

    return (
        <>
            <h1>List page</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`./${user.username}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
} 