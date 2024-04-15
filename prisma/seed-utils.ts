import crypto from 'crypto'

export const addDaysToDate = (days: number = 0) => {
	var today = new Date()
	var futureDate = new Date(today)
	futureDate.setDate(today.getDate() + days)
	return futureDate
}

export const generateBookingRef = () => {
	// Generate a random buffer of 8 bytes
	const randomBuffer = crypto.randomBytes(8)

	// Convert the buffer to a hexadecimal string
	const hexString = randomBuffer.toString('hex')

	// Take the first 16 characters to ensure it's exactly 16 digits
	const referenceString = hexString.slice(0, 16)

	return referenceString
}
