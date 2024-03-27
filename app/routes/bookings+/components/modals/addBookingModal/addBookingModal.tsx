import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'

type Pet = {
	id: string
	name: string
}

type AddBookingModalProps = {
	isPending: boolean
	onCloseRoute: string | Partial<Path>
	pets: Pet[]
}

export const AddBookingModal = ({
	onCloseRoute,
	pets,
}: AddBookingModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
			<h1>Add Booking</h1>
			<Form method="POST">
				<div>
					<label htmlFor="pet">Pet: </label>
					<select name="petId">
						{pets.map(pet => (
							<option key={pet.id} value={pet.id}>
								{pet.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="startDate">Date start: </label>
					<input type="date" name="startDate" />
				</div>
				<div>
					<label htmlFor="endDate">Date end: </label>
					<input type="date" name="endDate" />
				</div>
				<button type="submit" className="btn">
					Save
				</button>
			</Form>
		</RouteBasedModal>
	)
}
