/**
 * All absolute routes from the root url. Makes it easier when changes need to be made
 */

// "/bookings"
export const bookingsListPage = '/bookings'
export const bookingDetailsPage = (bookingId: string) =>
	`${bookingsListPage}/${bookingId}`

export const addBookingModalBookingsListPage = `${bookingsListPage}/add`
export const updateBookingModalBookingDetailsPage = (bookingId: string) =>
	`${bookingDetailsPage(bookingId)}/update`
export const deleteBookingModalBookingDetailsPage = (bookingId: string) =>
	`${bookingDetailsPage(bookingId)}/delete`

// "/pets"
export const petsListPage = '/pets'
export const petDetailsPage = (petId: string) => `${petsListPage}/${petId}`

export const addPetModalPetsListPage = `${petsListPage}/add`
export const updatePetModalPetDetailsPage = (petId: string) =>
	`${petDetailsPage(petId)}/update`
export const deletePetModalPetDetailsPage = (petId: string) =>
	`${petDetailsPage(petId)}/delete`

// "/users"
export const usersListPage = '/users'
export const userDetailsPage = (userId: string) => `${usersListPage}/${userId}`

export const addUserModalUsersListPage = `${usersListPage}/add`
export const updateUserModalUserDetailsPage = (userId: string) =>
	`${userDetailsPage(userId)}/update`
export const deleteUserModalUserDetailsPage = (userId: string) =>
	`${userDetailsPage(userId)}/delete`
