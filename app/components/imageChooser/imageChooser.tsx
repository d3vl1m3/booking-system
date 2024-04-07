import { FieldMetadata, getInputProps } from '@conform-to/react'
import { useState } from 'react'
import { z } from 'zod'
import { ImageSchema } from '~/routes/pets+/_index+/_modals+/add/_addPetRoute'
import { cn } from '~/utils/misc'

export function ImageChooser({
	config,
}: {
	// 🐨 change this prop to "config" which is Conform FieldConfig of the ImageFieldsetSchema
	config: FieldMetadata<z.infer<typeof ImageSchema>>
}) {
	const fileInputProps = getInputProps(config.getFieldset().file, {
		type: 'file',
	})
	// 🐨 create a ref for the fieldset
	// 🐨 create a conform fields object with useFieldset

	// 🐨 the existingImage should now be based on whether fields.id.defaultValue is set
	const existingImage = Boolean(config.value?.id)
	const [previewImage, setPreviewImage] = useState<string | null>(
		// 🐨 this should now reference fields.id.defaultValue
		existingImage ? `/resources/images/${config.id}` : null,
	)
	// 🐨 this should now reference fields.altText.defaultValue
	const [altText, setAltText] = useState(config.value?.altText ?? '')

	return (
		// 🐨 pass the ref prop to fieldset
		<fieldset>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							// 🐨 update this htmlFor to reference fields.file.id
							htmlFor="image-input"
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-4': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									<img
										src={previewImage}
										alt={altText ?? ''}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									➕
								</div>
							)}
							{existingImage ? (
								<input {...getInputProps(config.id, { type: 'hidden' })} />
							) : null}
							<input
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={event => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								// 💣 remove the name and type props
								{...fileInputProps}
								accept="image/*"
								// 🐨 add the props from conform.input with the fields.file with a {type: 'file'},
								// otherwise it will be treated as a text input
							/>
						</label>
					</div>
				</div>
				<div className="flex-1">
					{/* 🐨 update this htmlFor to reference fields.altText.id */}
					<label htmlFor="altText">Alt Text</label>
					<textarea
						// 💣 remove the id, name, and defaultValue
						id="altText"
						name="altText"
						defaultValue={altText}
						onChange={e => setAltText(e.currentTarget.value)}
						// 🐨 add the props from conform.textarea with the fields.altText
					/>
				</div>
			</div>
		</fieldset>
	)
}
