import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { useLoaderData, useLocation, useNavigation } from '@remix-run/react'
import {
	addBookingModalBookingsListPage,
	bookingDetailsPage,
	bookingsListPage,
} from '~/routes'
import { AddBookingModal } from '~/routes/bookings+/components/modals/addBookingModal/addBookingModal'
import { db, prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader() {
	const pets = await prisma.pet.findMany({
		select: {
			id: true,
			name: true,
		},
	})

	return json({ pets })
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const petId = formData.get('petId')
	const startDate = formData.get('startDate')
	const endDate = formData.get('endDate')

	invariantResponse(typeof petId === 'string', 'Invalid Pet ID value')
	invariantResponse(petId, 'Pet ID cannot be empty')

	invariantResponse(typeof startDate === 'string', 'Invalid Start Date value')
	invariantResponse(startDate, 'startDate cannot be empty')

	invariantResponse(typeof endDate === 'string', 'Invalid End Date value')
	invariantResponse(endDate, 'endDate cannot be empty')

	const pet = db.pet.findFirst({
		where: {
			id: {
				equals: petId,
			},
		},
	})

	invariantResponse(pet, `Pet not found with ID "${petId}"`)

	const booking = db.booking.create({
		dateStart: new Date(startDate).toDateString(),
		dateEnd: new Date(endDate).toDateString(),
		pets: [pet],
	})

	invariantResponse(booking, 'Failed to create booking', { status: 409 })

	return redirect(bookingDetailsPage(booking.id))
}

export default function AddBookingRoute() {
	const { pets } = useLoaderData<typeof loader>()
	const navigation = useNavigation()

	const isPending = navigation.state !== 'idle'

	return (
		<AddBookingModal
			isPending={isPending}
			pets={pets}
			onCloseRoute={bookingsListPage}
		/>
	)
}
