import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useFormAction, useLoaderData } from '@remix-run/react'
import { UpdateUserModal } from '~/routes/users+/components/updateUserModal/updateUserModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const { userId } = params

	const user = db.user.findFirst({
		where: {
			id: {
				equals: userId,
			},
		},
	})

	const owners = db.user.getAll().map(({ name, id }) => ({ name, id }))

	invariantResponse(user, 'User not found')
	invariantResponse(owners, 'Owners not found')

	return json({
		user: {
			name: user.name,
		},
		owners,
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

	return <UpdateUserModal name={user.name} />
}
