/**
 * Don't worry too much about this file. It's just an in-memory "database"
 * for the purposes of our workshop. The data modeling workshop will cover
 * the proper database.
 */
import crypto from 'crypto'
import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data'
import { singleton } from './singleton.server'
import { invariantResponse } from '~/utils/misc'

const getId = () => crypto.randomBytes(16).toString('hex').slice(0, 8)

export const db = singleton('db', () => {
	const db = factory({
		user: {
			id: primaryKey(getId),
			createdAt: () => new Date(),

			email: String,
			name: String,
			username: String,
		},
		pet: {
			id: primaryKey(getId),
			createdAt: () => new Date(),

			name: String,
			owners: manyOf('user'),
		},
		booking: {
			id: primaryKey(getId),
			createdAt: () => new Date(),

			bookedBy: oneOf('user'),
			dateStart: Date,
			dateEnd: Date,
			bookingRefrence: getId,
			pets: manyOf('pet'),
		},
	})

	const userLiam = db.user.create({
		email: 'dev_lime@protonmail.com',
		username: 'D3VL1M3',
		name: 'Liam',
	})

	const userGema = db.user.create({
		email: 'dev_lime@pm.me',
		username: 'G3M4',
		name: 'Gema',
	})

	const pets = [
		{
			name: 'Choji',
			owners: [userLiam],
		},
		{
			name: 'Stitch',
			owners: [userGema],
		},
		{
			name: 'Bombhead',
			owners: [userGema],
		},
		{
			name: 'Blue',
			owners: [userGema],
		},
	]

	for (const pet of pets) {
		db.pet.create(pet)
	}

	function addDays(daysToAdd: number) {
		const today = new Date()
		const futureDate = new Date(today)
		futureDate.setDate(today.getDate() + daysToAdd)
		return futureDate
	}

	const choji = db.pet.findFirst({
		where: {
			name: {
				equals: 'Choji',
			},
		},
	})

	const bombhead = db.pet.findFirst({
		where: {
			name: {
				equals: 'Bombhead',
			},
		},
	})

	invariantResponse(choji, 'Choji was not found when hydrating the DB!')
	invariantResponse(bombhead, 'Bombhead was not found when hydrating the DB!')

	const bookings = [
		{
			dateStart: addDays(3).toDateString(),
			dateEnd: addDays(4).toDateString(),
			bookedBy: userLiam,
			pets: [choji],
		},
		{
			dateStart: addDays(10).toDateString(),
			dateEnd: addDays(12).toDateString(),
			bookedBy: userGema,
			pets: [bombhead],
		},
	]

	for (const booking of bookings) {
		db.booking.create(booking)
	}

	return db
})
