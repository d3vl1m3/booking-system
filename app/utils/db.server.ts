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
			name: nullable(String),
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
			bookingRefrence: String,
			pets: manyOf('pet'),
		},
	})

	const userLiam = db.user.create({
		id: '9d6eba59daa2fc2078cf8205cd451041',
		email: 'dev_lime@protonmail.com',
		username: 'D3VL1M3',
		name: 'Liam',
	})

	const userGema = db.user.create({
		id: '9n3nbs05jdns9ba9239kc02847js5938',
		email: 'dev_lime@pm.me',
		username: 'G3M4',
		name: 'Gema',
	})


	const pets = [
		{
			id: 'd27a197e',
			name: 'Choji',
			owners: [userLiam]
		},
		{
			id: 'v27b3453',
			name: 'Stitch',
			owners: [userGema]
		},
		{
			id: 'j943hs96',
			name: 'Bombhead',
			owners: [userGema]
		},
		{
			id: 'mk6094sh',
			name: 'Blue',
			owners: [userGema]
		},
	]

	for (const pet of pets) {
		db.pet.create(pet)
	}


	function addDays(daysToAdd: number) {
		const today = new Date();
		const futureDate = new Date(today);
		futureDate.setDate(today.getDate() + daysToAdd);
		return futureDate;
	}

	const choji = db.pet.findFirst({
		where: {
			name: {
				equals: 'Choji'
			}
		}
	})

	invariantResponse(choji, 'Choji was not found when hydrating the DB!')

	db.booking.create({
		id: '84jhsop947b2b2950kdsbnn383j2j2j2',
		bookingRefrence: 'DG-4730as',
		dateStart: addDays(3).toDateString(),
		dateEnd: addDays(4).toDateString(),
		bookedBy: userLiam,
		pets: [choji]
	})

	return db
})
