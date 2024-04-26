import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
import { addDaysToDate, generateBookingRef } from './seed-utils'

import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Clear all the current data
// The following records are all deleted as well due to the joins:
// Booking, PetImage
await prisma.user.deleteMany()
await prisma.pet.deleteMany()

// Create a user
await prisma.user.create({
	data: {
		email: faker.internet.email(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
		pets: {
			create: [
				{
					name: 'Choji',
					bookings: {
						create: [
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(1),
								dateEnd: addDaysToDate(3),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(5),
								dateEnd: addDaysToDate(6),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(14),
								dateEnd: addDaysToDate(15),
							},
						],
					},
					images: {
						create: [
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-1.png',
								),
							},
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-2.png',
								),
							},
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-3.png',
								),
							},
						],
					},
				},
				{
					name: 'Patch',
					bookings: {
						create: [
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(1),
								dateEnd: addDaysToDate(2),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(5),
								dateEnd: addDaysToDate(8),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(11),
								dateEnd: addDaysToDate(18),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(21),
								dateEnd: addDaysToDate(22),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(5),
								dateEnd: addDaysToDate(6),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(14),
								dateEnd: addDaysToDate(15),
							},
						],
					},
					images: {
						create: [
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-1.png',
								),
							},
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-2.png',
								),
							},
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-3.png',
								),
							},
						],
					},
				},
			],
		},
	},
})

// Create another user
await prisma.user.create({
	data: {
		email: faker.internet.email(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
		pets: {
			create: [
				{
					name: 'Star',
					bookings: {
						create: [
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(2),
								dateEnd: addDaysToDate(3),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(5),
								dateEnd: addDaysToDate(7),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(11),
								dateEnd: addDaysToDate(15),
							},
						],
					},
					images: {
						create: [
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-1.png',
								),
							},
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-2.png',
								),
							},
							{
								altText: 'A picture of a jack russel',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/jack-3.png',
								),
							},
						],
					},
				},
				{
					name: 'Chance',
					bookings: {
						create: [
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(3),
								dateEnd: addDaysToDate(6),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(7),
								dateEnd: addDaysToDate(8),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(11),
								dateEnd: addDaysToDate(12),
							},
							{
								bookingRefrence: generateBookingRef(),
								dateStart: addDaysToDate(13),
								dateEnd: addDaysToDate(14),
							},
						],
					},
					images: {
						create: [
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-1.png',
								),
							},
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-2.png',
								),
							},
							{
								altText: 'A picture of a boxer',
								contentType: 'image/jpeg',
								blob: await fs.promises.readFile(
									'./tests/fixtures/bookings/images/boxer-3.png',
								),
							},
						],
					},
				},
			],
		},
	},
})

// Create more users...
for (let i = 0; i < 10; i++) {
	await prisma.user.create({
		data: {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			name: faker.person.fullName(),
		},
	})
}
