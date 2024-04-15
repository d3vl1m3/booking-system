import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { bookingDetailsPage } from '~/routes'
import { UpdateBookingModal } from '~/routes/bookings+/components/modals/updateBookingModal/updateBookingModal'
import { db, prisma } from '~/utils/db.server'
import { invariantResponse } from '~/utils/misc'

export async function loader({ params }: LoaderFunctionArgs) {
	const booking = await prisma.booking.findUnique({
		where: {
			id: params.bookingId,
		},
		select: {
			id: true,
			dateStart: true,
			dateEnd: true,
			pet: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	})

	invariantResponse(booking, `No booking found for ID: ${params.bookingId}`)

	return json({
		booking,
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

	return redirect(bookingDetailsPage(booking.id))
}

export default function UpdateBookingRoute() {
	const { booking } = useLoaderData<typeof loader>()

	return (
		<UpdateBookingModal
			endDate={booking.dateStart}
			onCloseRoute={bookingDetailsPage(booking.id)}
			pet={booking.pet}
			startDate={booking.dateEnd}
		/>
	)
}
