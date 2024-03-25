import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { usersListPage } from '~/routes'
import { AddUserModal } from '~/routes/users+/components/addUserModal/addUserModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const name = formData.get('name')

	invariantResponse(name, 'User name required', { status: 422 })

	invariantResponse(
		typeof name === 'string',
		`User name has invlaid value: ${typeof name !== 'string'}`,
		{ status: 422 },
	)

	const user = db.user.create({
		name,
	})

	invariantResponse(user, 'Failed to create user', { status: 409 })

	return redirect('/users')
}

export default function AddUserRoute() {
	return <AddUserModal onCloseRoute={usersListPage} />
}
