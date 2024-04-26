import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { prisma } from 'app/utils/db.server'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { addUserModalUsersListPage, userDetailsPage } from '~/routes'
import { z } from 'zod'
import { ErrorList } from '~/components/errorList/errorList'

type User = {
	id: string
	name: string | null
	username: string
}

const UserSeachResultSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	username: z.string(),
	imageId: z.string().nullable(),
})

const UserSeachResultListSchema = z.array(UserSeachResultSchema)

export async function loader({ request }: LoaderFunctionArgs) {
	// get the search param from the URL
	const search = new URL(request.url).searchParams.get('search')

	const like = `%${search ?? ''}%`

	// if a search param is passed in the URL, filter the users by name
	const rawUsers: User[] = await prisma.$queryRaw`
		SELECT name, id, username 
		FROM "User"
		WHERE username LIKE ${like} OR name LIKE ${like} 
		LIMIT 50`

	const result = UserSeachResultListSchema.safeParse(rawUsers)

	if (!result.success) {
		return json(
			{
				status: 'error',
				error: result.error.message,
			} as const,
			{ status: 400 },
		)
	}

	return json({ status: 'idle', users: result.data } as const)
}

export default function UsersListPage() {
	const data = useLoaderData<typeof loader>()

	if (data.status === 'error') {
		console.error(data.error)
	}

	return (
		<>
			<h1>List page</h1>
			<ul>
				<li>
					<Link to={addUserModalUsersListPage}>Add User</Link>
				</li>
			</ul>
			{data.status === 'idle' ? (
				<>
					{data.users.length > 0 ? (
						<ul>
							{data.users.map(user => (
								<li key={user.id}>
									<Link to={userDetailsPage(user.id)}>{user.name}</Link>
								</li>
							))}
						</ul>
					) : (
						<p>No users found</p>
					)}
				</>
			) : null}
			{data.status === 'error' ? (
				<ErrorList errors={['There was an error parsing the results']} />
			) : null}
			<Outlet />
		</>
	)
}
