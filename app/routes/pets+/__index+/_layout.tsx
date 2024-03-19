import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { db } from 'app/utils/db.server'
import { json } from "@remix-run/node";


export async function loader() {
	const pets = db.pet
        .getAll()
		.map(({ id, name }) => ({ id, name}))
	return json({ pets })
}

export default function PetsListPage() {
	const { pets } = useLoaderData<typeof loader>()


    return (
        <>
            <h1>Pets List Page</h1>
            <Link to='./modals/edit'>Edit Modal</Link>
            <Link to='./modals/create'>Create Modal</Link>
            <Outlet/>
            { pets.length ? (
                <ul>
                    {
                    pets.map((pet) => (
                        <li key={pet.id}>
                            <Link to={`./${pet.id}`}> 
                                {pet.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : 'No pets'}
        </>
    )
} 