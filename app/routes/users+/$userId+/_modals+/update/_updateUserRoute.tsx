import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { userDetailsPage } from '~/routes'
import { UpdateUserModal } from '~/routes/users+/components/updateUserModal/updateUserModal'
import { db, prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const { userId } = params

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	})

	invariantResponse(user, 'User not found')

	return json({
		user,
	})
}

export async function action({ params, request }: ActionFunctionArgs) {
	const { userId } = params

	const formData = await request.formData()
	const name = formData.get('name')

	invariantResponse(typeof name === 'string', 'Invalid name value')
	invariantResponse(name, 'Name cannot be blank')

	db.user.update({
		where: {
			id: {
				equals: userId,
			},
		},
		data: {
			name,
		},
	})

	return redirect(`/users/${userId}`)
}

export default function UpdateUserRoute() {
	const { user } = useLoaderData<typeof loader>()

	return (
		<UpdateUserModal name={user.name} onCloseRoute={userDetailsPage(user.id)} />
	)
}
