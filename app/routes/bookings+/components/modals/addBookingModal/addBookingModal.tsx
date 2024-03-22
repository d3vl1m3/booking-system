import { Form } from '@remix-run/react'
import { RouteBasedModal } from '~/components/RouteBasedModal/routeBasedModal'

type Pet = {
	id: string
	name: string
}

type AddBookingModalProps = {
	pets: Pet[]
}

export const AddBookingModal = ({ pets }: AddBookingModalProps) => {
	return (
		<RouteBasedModal>
			<h1>Add Booking</h1>
			<Form method="POST">
				<div>
					<label htmlFor="pet">Pet: </label>
					<select name="petId">
						{pets.map(pet => (
							<option value={pet.id}>{pet.name}</option>
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
