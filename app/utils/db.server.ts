/**
 * Don't worry too much about this file. It's just an in-memory "database"
 * for the purposes of our workshop. The data modeling workshop will cover
 * the proper database.
 */
import crypto from 'crypto'
import { factory, manyOf, nullable, primaryKey } from '@mswjs/data'
import { singleton } from './singleton.server'

const getId = () => crypto.randomBytes(16).toString('hex').slice(0, 8)

export const db = singleton('db', () => {
	const db = factory({
		user: {
			id: primaryKey(getId),
			email: String,
			username: String,
			name: nullable(String),

			createdAt: () => new Date(),
		},
		pet: {
			id: primaryKey(getId),
			name: String,

			createdAt: () => new Date(),

			owners: manyOf('user'),
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

	return db
})
