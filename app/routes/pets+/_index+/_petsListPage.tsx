import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'
import { json } from '@remix-run/node'
import { addPetModalPetsListPage, petDetailsPage } from '~/routes'

export async function loader() {
	const pets = db.pet.getAll().map(({ id, name }) => ({ id, name }))
	return json({ pets })
}

export default function PetsListPage() {
	const { pets } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>Pets List Page</h1>
			<ul>
				<li>
					<Link to={addPetModalPetsListPage}>Add Pet</Link>
				</li>
			</ul>
			{pets.length ? (
				<ul>
					{pets.map(pet => (
						<li key={pet.id}>
							<Link to={petDetailsPage(pet.id)}>{pet.name}</Link>
						</li>
					))}
				</ul>
			) : (
				'No pets'
			)}

			<Outlet />
		</>
	)
}
