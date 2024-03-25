import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { bookingDetailsPage, bookingsListPage } from '~/routes'
import { UpdateBookingModal } from '~/routes/bookings+/components/modals/updateBookingModal/updateBookingModal'
import { db } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export function loader({ params }: LoaderFunctionArgs) {
	const booking = db.booking.findFirst({
		where: {
			id: {
				equals: params.bookingId,
			},
		},
	})

	invariantResponse(booking, `No booking found for ID: ${params.bookingId}`)

	const pets = db.pet.getAll().map(({ id, name }) => ({ id, name }))

	return json({
		pets,
		booking: {
			id: booking.id,
			pet: booking.pets[0],
			startDate: booking.dateStart,
			endDate: booking.dateEnd,
		},
	})
}

export async function action({ params, request }: ActionFunctionArgs) {
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

	const booking = db.booking.update({
		where: {
			id: {
				equals: params.bookingId,
			},
		},
		data: {
			dateStart: new Date(startDate).toDateString(),
			dateEnd: new Date(endDate).toDateString(),
			pets: [pet],
		},
	})

	invariantResponse(booking, 'Failed to create booking', { status: 409 })

	return redirect('/bookings')
}

export default function UpdateBookingRoute() {
	const { pets, booking } = useLoaderData<typeof loader>()

	return (
		<UpdateBookingModal
			endDate={booking.endDate}
			onCloseRoute={bookingDetailsPage(booking.id)}
			bookedPet={booking.pet}
			pets={pets}
			startDate={booking.startDate}
		/>
	)
}
