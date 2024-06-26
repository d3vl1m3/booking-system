import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Pet = {
	id: string
	name: string
}

type AddBookingModalProps = {
	endDate: string
	onCloseRoute: string | Partial<Path>
	pet: Pet
	startDate: string
}

function jsDateToDateInputFormat(date = new Date()) {
	const year = date.toLocaleString('default', { year: 'numeric' })
	const month = date.toLocaleString('default', {
		month: '2-digit',
	})
	const day = date.toLocaleString('default', { day: '2-digit' })

	return [year, month, day].join('-')
}

export const UpdateBookingModal = ({
	endDate,
	onCloseRoute,
	pet,
	startDate,
}: AddBookingModalProps) => {
	const startDateFormatted = jsDateToDateInputFormat(new Date(startDate))
	const endDateFormatted = jsDateToDateInputFormat(new Date(endDate))

	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Update Booking</h1>
			<Form method="POST">
				<div>
					<label htmlFor="pet">Pet: </label>
					<input type="text" name="pet" readOnly defaultValue={pet.name} />
				</div>
				<div>
					<label htmlFor="startDate">Date start: </label>
					<input
						type="date"
						name="startDate"
						defaultValue={startDateFormatted}
					/>
				</div>
				<div>
					<label htmlFor="endDate">Date end: </label>
					<input type="date" name="endDate" defaultValue={endDateFormatted} />
				</div>
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
