import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { ErrorList } from '../errorList/errorList'

const SearchFormSchema = z.object({
	search: z
		.string({
			required_error: 'Search field cannot be empty',
		})
		.min(1, 'Must be at least 1 character long'),
})

export const UserSearchField = () => {
	const [form, fields] = useForm({
		id: 'search-form',
		constraint: getZodConstraint(SearchFormSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: SearchFormSchema })
		},
		defaultValue: {
			search: '',
		},
	})

	const formProps = getFormProps(form)
	const searchFieldProps = getInputProps(fields.search, {
		type: 'text',
	})

	return (
		<form {...formProps} method="get" action="users">
			<label htmlFor={searchFieldProps.id} className="sr-only">
				Search users
			</label>
			<div className="inline-block">
				<input
					{...searchFieldProps}
					placeholder="Search users"
					className="border border-gray-500 mr-1 p-2"
				/>
				<ErrorList errors={fields.search.errors} id={searchFieldProps.id} />
			</div>
			<button type="submit" className="btn align-top bg-gray-800">
				<span className="sr-only">Search</span>
				🔍
			</button>
			<ErrorList errors={form.errors} id={form.id} />
		</form>
	)
}
