import ReactModal from 'react-modal'
import { LinksFunction, LoaderFunctionArgs, json } from '@remix-run/node'
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'

import TailwindCssUrl from '~/styles/tailwind.css?url'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { honeypot } from './utils/honeypot.server'
import { getEnv } from './utils/env.server'
import { csrf } from './utils/csrf.server'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'

ReactModal.setAppElement('#app')

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: TailwindCssUrl,
	},
]

export async function loader({ request }: LoaderFunctionArgs) {
	const honeyProps = honeypot.getInputProps()
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken(request)

	return json(
		{ ENV: getEnv(), honeyProps, csrfToken },
		{
			headers: csrfCookieHeader
				? {
						'set-cookie': csrfCookieHeader,
				  }
				: {},
		},
	)
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body id="app">
				<header>
					<Link className="heading-1" to="/">
						Pet booker
					</Link>
					<nav>
						<ul>
							<li>
								<Link to={'users/me'}>My profile</Link>
							</li>
							<li>
								<Link to={'users'}>Users</Link>
							</li>
							<li>
								<Link to={'pets'}>Pets</Link>
							</li>
							<li>
								<Link to={'bookings'}>Bookings</Link>
							</li>
						</ul>
					</nav>
				</header>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<Outlet />
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	)
}
