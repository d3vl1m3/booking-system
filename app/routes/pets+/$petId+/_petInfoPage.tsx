import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { invariantResponse } from '~/utils/misc'
import { prisma } from '~/utils/db.server'
import {
	deletePetModalPetDetailsPage,
	petsListPage,
	updatePetModalPetDetailsPage,
	userDetailsPage,
} from '~/routes'

export async function loader({ params }: LoaderFunctionArgs) {
	const pet = await prisma.pet.findUnique({
		where: {
			id: params.petId,
		},
		select: {
			name: true,
			id: true,
			owners: {
				select: {
					id: true,
					name: true,
					username: true,
				},
			},
			images: {
				select: {
					id: true,
					altText: true,
				},
			},
		},
	})

	invariantResponse(pet, 'Pet not found', { status: 404 })

	return json({ pet })
}

export default function PetInfoPage() {
	const { pet } = useLoaderData<typeof loader>()

	return (
		<>
			<h1>{pet.name}&#39;s info</h1>
			{pet.images.length
				? pet.images.map(image => (
						<a href={`/resources/images/${image.id}`}>
							<img
								src={`/resources/images/${image.id}`}
								alt={image.altText ?? ''}
								className="h-32 w-32 rounded-lg object-cover"
							/>
						</a>
				  ))
				: null}
			<ul>
				<li>
					<Link className="btn inline-block" to={petsListPage}>
						Back to Pets List
					</Link>
				</li>
				<li>
					<Link
						className="btn inline-block"
						to={updatePetModalPetDetailsPage(pet.id)}
					>
						Update Pet
					</Link>
				</li>
				<li>
					<Link
						className="btn inline-block"
						to={deletePetModalPetDetailsPage(pet.id)}
					>
						Delete Pet
					</Link>
				</li>
			</ul>
			<p>Pet ID: {pet.id}</p>
			<p>Owners:</p>
			<ul>
				{pet.owners.map(owner => (
					<Link key={owner.id} to={userDetailsPage(owner.id)}>
						{owner.name || owner.username}
					</Link>
				))}
			</ul>

			<Outlet />
		</>
	)
}
