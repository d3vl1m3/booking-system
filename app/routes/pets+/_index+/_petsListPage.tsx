import { Link, Outlet, useLoaderData } from '@remix-run/react'

import { prisma } from '~/utils/db.server'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import {
	addPetModalPetsListPage,
	petDetailsPage,
	petImageResource,
} from '~/routes'
import { PetSearchField } from '~/components/petSearchField/petSearchField'
import { z } from 'zod'
import { image } from 'remix-utils/responses'

type Owner = {
	id: string
	name: string | null
	username: string
}

type Image = {
	id: string
}

type Pet = {
	id: string
	name: string | null
	owners: Owner[]
	images: Image[]
}

const PetSeachResultSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
})

const PetSeachResultListSchema = z.array(PetSeachResultSchema)

export async function loader({ request }: LoaderFunctionArgs) {
	// get the search param from the URL
	const search = new URL(request.url).searchParams.get('search')

	const like = `%${search ?? ''}%`

	// get all the pets that match the query and a single image for each pet
	const rawPets: Pet[] = await prisma.$queryRaw`
		SELECT pet.id, pet.name, petImage.id as "imageId"
		FROM "Pet" pet
		LEFT JOIN (
			-- select the first image for each pet
			SELECT id, petId
			FROM "PetImage"
			WHERE id IN (
				SELECT id
				FROM "PetImage"
				GROUP BY "petId"
			)
		) petImage ON pet.id = petImage.petId
		WHERE pet.name LIKE ${like}
		LIMIT 50`

	const result = PetSeachResultListSchema.safeParse(rawPets)

	if (!result.success) {
		return json(
			{
				status: 'error',
				error: result.error.message,
			} as const,
			{ status: 400 },
		)
	}

	return json({ status: 'idle', pets: result.data } as const)
}

export default function PetsListPage() {
	const data = useLoaderData<typeof loader>()

	if (data.status === 'error') {
		console.error(data.error)
	}

	return (
		<>
			<h1>Pets List Page</h1>
			<PetSearchField />
			<ul>
				<li>
					<Link className="btn inline-block" to={addPetModalPetsListPage}>
						Add Pet
					</Link>
				</li>
			</ul>
			{data.status === 'idle' ? (
				data.pets.length ? (
					<ul>
						{data.pets.map(pet => (
							<li key={pet.id}>
								<Link to={petDetailsPage(pet.id)}>
									{pet.name}
									{pet.imageId ? (
										<img
											src={petImageResource(pet.imageId) ?? ''}
											alt={pet.name ?? 'Pet image'}
										/>
									) : null}
								</Link>
							</li>
						))}
					</ul>
				) : (
					'No pets'
				)
			) : null}

			<Outlet />
		</>
	)
}
