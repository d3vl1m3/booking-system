import { Path, useNavigate } from '@remix-run/react';
import { ReactNode, useRef } from 'react';
import ReactModal from 'react-modal';


export const RouteBasedModal = ({
    children,
    /**
     * Root to navigate to when the modal is closed
     * @default '../' Navigates to the current routes parent route
     */
    onCloseRoute = '../',
    ...props
}: {
    children: ReactNode
    onCloseRoute?: string | Partial<Path>;
} & Omit<ReactModal.Props, 'isOpen' | 'onRequestClose'>) =>{
    const navigate = useNavigate();
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const handlOnClose = () => {
        navigate(onCloseRoute)
    }
 
    return (
        <ReactModal 
        {...props} 
        isOpen
        onRequestClose={handlOnClose}
        onAfterOpen={() => closeButtonRef.current?.focus()}
    >
        <button onClick={handlOnClose} className='btn' ref={closeButtonRef}>close</button>
        {children}
    </ReactModal>
    )
}