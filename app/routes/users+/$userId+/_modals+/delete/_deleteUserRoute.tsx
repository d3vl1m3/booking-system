import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node'
import { useLoaderData, json } from '@remix-run/react'
import { userDetailsPage, usersListPage } from '~/routes'
import { DeleteUserModal } from '~/routes/users+/components/deleteUserModal/deleteUserModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			id: {
				equals: params.userId,
			},
		},
	})

	invariantResponse(user, 'User not found')

	return json({
		user: {
			name: user.name,
			id: user.id,
		},
	})
}

export function action({ params }: ActionFunctionArgs) {
	const { userId } = params

	db.user.delete({
		where: {
			id: {
				equals: userId,
			},
		},
	})

	return redirect(usersListPage)
}

export default function DeleteUserRoute() {
	const { user } = useLoaderData<typeof loader>()
	return (
		<DeleteUserModal name={user.name} onCloseRoute={userDetailsPage(user.id)} />
	)
}
