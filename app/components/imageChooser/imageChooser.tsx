import {
	FieldMetadata,
	getInputProps,
	getTextareaProps,
} from '@conform-to/react'
import { useState } from 'react'
import { z } from 'zod'
import { petImageResource } from '~/routes'
import { ImageSchema } from '~/routes/pets+/$petId+/_modals+/update/_updatePetRoute'
import { cn } from '~/utils/misc'

export function ImageChooser({
	config,
}: {
	config: FieldMetadata<z.infer<typeof ImageSchema>>
}) {
	const fileInputProps = getInputProps(config.getFieldset().file, {
		type: 'file',
	})
	const idInputProps = getInputProps(config.getFieldset().file, {
		type: 'hidden',
	})

	const altTextProps = getTextareaProps(config.getFieldset().altText)

	const existingImage = Boolean(config.value?.id)
	const [previewImage, setPreviewImage] = useState<string | null>(
		existingImage ? petImageResource(config.value?.id) : null,
	)
	const [altText, setAltText] = useState(config.value?.altText ?? '')

	return (
		// 🐨 pass the ref prop to fieldset
		<fieldset>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							htmlFor={fileInputProps.id}
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
							{existingImage ? <input {...idInputProps} /> : null}
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
								{...fileInputProps}
								accept="image/*"
							/>
						</label>
					</div>
				</div>
				<div className="flex-1">
					<label htmlFor={altTextProps.id}>Alt Text</label>
					<textarea
						onChange={e => setAltText(e.currentTarget.value)}
						{...altTextProps}
					/>
				</div>
			</div>
		</fieldset>
	)
}
