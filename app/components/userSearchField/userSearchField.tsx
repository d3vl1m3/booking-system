export const UserSearchField = () => {
	return (
		<form method="get" action="users">
			<label htmlFor="search" className="sr-only">
				Search users
			</label>
			<input
				type="text"
				name="search"
				id="search"
				className="border border-gray-500 mr-1 p-2"
			/>
			<button type="submit" className="btn">
				Search Users
			</button>
		</form>
	)
}
