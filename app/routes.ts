/**
 * All absolute routes from the root url. Makes it easier when changes need to be made
 */

// "/bookings"
export const bookingsListPage = '/bookings'
export const bookingDetailsPage = (bookingId: string) =>
	`${bookingsListPage}/${bookingId}`

export const addBookingModalBookingsListPage = `${bookingsListPage}/add`
export const updateBookingModalBookingListPage = (bookingId: string) =>
	`${bookingDetailsPage(bookingId)}/update`
export const deleteBookingModalBookingListPage = (bookingId: string) =>
	`${bookingDetailsPage(bookingId)}/delete`

// "/pets"
export const petsListPage = '/pets'
export const petDetailsPage = (petId: string) => `${petsListPage}/${petId}`

export const addPetModalPetsListPage = `${petsListPage}/add`
export const updatePetModalPetListPage = (petId: string) =>
	`${petDetailsPage(petId)}/update`
export const deletePetModalPetListPage = (petId: string) =>
	`${petDetailsPage(petId)}/delete`

// "/users"
export const usersListPage = '/users'
export const userDetailsPage = (userId: string) => `${usersListPage}/${userId}`

export const addUserModalUsersListPage = `${usersListPage}/add`
export const updateUserModalUserListPage = (userId: string) =>
	`${userDetailsPage(userId)}/update`
export const deleteUserModalUserListPage = (userId: string) =>
	`${userDetailsPage(userId)}/delete`
