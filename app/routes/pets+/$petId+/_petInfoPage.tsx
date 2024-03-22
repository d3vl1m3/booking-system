import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { invariantResponse } from '~/utils/misc'
import { db } from '~/utils/db.server'

export async function loader({ params }: LoaderFunctionArgs) {
	const pet = db.pet.findFirst({
		where: {
			id: {
				equals: params.petId,
			},
		},
	})

	invariantResponse(pet, 'Pet not found', { status: 404 })

	return json({
		pet: {
			name: pet.name,
			id: pet.id,
			owners: pet.owners,
		},
	})
}

export default function PetInfoPage() {
	const { pet } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>{pet.name}&#39;s info</h1>
			<ul>
				<li>
					<Link to="./..">Back to Pets List</Link>
				</li>
				<li>
					<Link to="./update">Update Pet</Link>
				</li>
				<li>
					<Link to="./delete">Delete Pet</Link>
				</li>
			</ul>
			<p>Pet ID: {pet.id}</p>
			<p>Owners:</p>
			<ul>
				{pet.owners.map(owner => (
					<Link key={owner.id} to={`/users/${owner.username}`}>
						{owner.name}
					</Link>
				))}
			</ul>

			<Outlet />
		</>
	)
}
