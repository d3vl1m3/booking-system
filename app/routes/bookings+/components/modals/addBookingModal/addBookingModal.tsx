import { Form, Path } from '@remix-run/react'
import { RouteBasedModal } from '~/components/routeBasedModal/routeBasedModal'
import { petsListPage } from '~/routes'

type Pet = {
	id: string
	name: string
}

type AddBookingModalProps = {
	pets: Pet[]
	onCloseRoute: string | Partial<Path>
}

export const AddBookingModal = ({
	pets,
	onCloseRoute,
}: AddBookingModalProps) => {
	return (
		<RouteBasedModal onCloseRoute={onCloseRoute}>
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
