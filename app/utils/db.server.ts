/**
 * Don't worry too much about this file. It's just an in-memory "database"
 * for the purposes of our workshop. The data modeling workshop will cover
 * the proper database.
 */
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { factory, manyOf, nullable, primaryKey } from '@mswjs/data'
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
			images: manyOf('image'),
		},
		booking: {
			id: primaryKey(getId),
			createdAt: () => new Date(),

			cancelled: nullable(Boolean),
			dateStart: Date,
			dateEnd: Date,
			bookingRefrence: getId,
			pets: manyOf('pet'),
		},
		image: {
			id: primaryKey(getId),
			filepath: String,
			contentType: String,
			altText: nullable(String),
		},
	})

	const userLiam = db.user.create({
		email: 'fake.alias+liam@passmail.com',
		username: 'D3VL1M3',
		name: 'Liam',
	})

	const userDev = db.user.create({
		email: 'fake.alias+dev@passmail.com',
		username: 'Dev',
		name: 'Lime',
	})

	const pets = [
		{
			name: 'Choji',
			owners: [userLiam],
		},
		{
			name: 'Patch',
			owners: [userDev],
		},
		{
			name: 'Belle',
			owners: [userDev],
		},
		{
			name: 'Syra',
			owners: [userDev],
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

	const patch = db.pet.findFirst({
		where: {
			name: {
				equals: 'Patch',
			},
		},
	})

	invariantResponse(choji, 'Choji was not found when hydrating the DB!')
	invariantResponse(patch, 'Patch was not found when hydrating the DB!')

	const bookings = [
		{
			dateStart: addDays(3).toDateString(),
			dateEnd: addDays(4).toDateString(),
			pets: [choji],
		},
		{
			dateStart: addDays(10).toDateString(),
			dateEnd: addDays(12).toDateString(),
			pets: [patch],
		},
	]

	for (const booking of bookings) {
		db.booking.create(booking)
	}

	return db
})

export const uploadImages = async (
	images: { file?: File; id?: string; altText?: string }[],
) => {
	const uploadedImagePromises = images?.map(async image => {
		if (!image) return null

		if (image.id) {
			const hasReplacement = (image?.file?.size || 0) > 0
			const filepath =
				image.file && hasReplacement ? await writeImage(image.file) : undefined
			// update the ID so caching is invalidated
			const id = image.file && hasReplacement ? getId() : image.id

			return db.image.update({
				where: { id: { equals: image.id } },
				data: {
					id,
					filepath,
					altText: image.altText,
				},
			})
		} else if (image.file) {
			if (image?.file.size < 1) return null
			const filepath = await writeImage(image.file)
			return db.image.create({
				altText: image.altText,
				filepath,
				contentType: image.file.type,
			})
		}

		return null
	})

	return await Promise.all(uploadedImagePromises)
}

async function writeImage(image: File) {
	const tmpDir = path.join(os.tmpdir(), 'assets', 'pet-images')
	await fs.mkdir(tmpDir, { recursive: true })

	const timestamp = Date.now()
	const filepath = path.join(tmpDir, `${timestamp}.${image.name}`)
	await fs.writeFile(filepath, Buffer.from(await image.arrayBuffer()))
	return filepath
}
