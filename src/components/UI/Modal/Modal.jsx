import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Backdrop from './Backdrop';
import ModalOverlay from './ModalOverlay';

export default function Modal({ children }) {
	const overlaysElement = document.getElementById('overlays');

	return (
		<Fragment>
			{ReactDOM.createPortal(<Backdrop />, overlaysElement)}
			{ReactDOM.createPortal(
				<ModalOverlay>{children}</ModalOverlay>,
				overlaysElement,
			)}
		</Fragment>
	);
}

