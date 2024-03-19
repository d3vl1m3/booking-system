import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { invariantResponse } from "~/routes/users_+/misc"
import { db } from "~/utils/db.server"


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
			owners: pet.owners
		},        
	})
}

export default function PetDetailsPage() {
    const {pet} = useLoaderData<typeof loader>()

    return <div>
        <h1>{pet.name}&#39;s details</h1>
        <p><Link to="./..">Back to Pets List</Link></p>
        <p>Pet ID: {pet.id}</p>
    </div>
} 