import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { userDetailsPage, usersListPage } from '~/routes'
import { DeleteUserModal } from '~/routes/users+/components/deleteUserModal/deleteUserModal'
import { prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const user = await prisma.user.findUnique({
		where: {
			id: params.userId,
		},
		select: {
			username: true,
			id: true,
		},
	})

	invariantResponse(user, 'User not found')

	return json({ user })
}

export function action({ params }: ActionFunctionArgs) {
	const { userId } = params

	prisma.user.delete({
		where: {
			id: userId,
		},
	})

	return redirect(usersListPage)
}

export default function DeleteUserRoute() {
	const { user } = useLoaderData<typeof loader>()
	return (
		<DeleteUserModal
			name={user.username}
			onCloseRoute={userDetailsPage(user.id)}
		/>
	)
}
