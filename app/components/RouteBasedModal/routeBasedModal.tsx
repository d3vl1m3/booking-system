import { Path, useNavigate } from '@remix-run/react'
import { ReactNode } from 'react'
import ReactModal from 'react-modal'

export const RouteBasedModal = ({
	children,
	/**
	 * Root to navigate to when the modal is closed
	 * @default '../' Navigates to the current routes parent route by default
	 */
	onCloseRoute = '../',
	...props
}: {
	children: ReactNode
	onCloseRoute?: string | Partial<Path>
} & Omit<ReactModal.Props, 'isOpen' | 'onRequestClose'>) => {
	const navigate = useNavigate()

	const handlOnClose = () => {
		navigate(onCloseRoute)
	}

	return (
		<ReactModal {...props} isOpen onRequestClose={handlOnClose}>
			<button onClick={handlOnClose} className="btn">
				close
			</button>
			{children}
		</ReactModal>
	)
}
