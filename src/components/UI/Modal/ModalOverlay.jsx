import classes from './ModalOverlay.module.css';

export default function ModalOverlay({ children }) {
	return <div className={classes.modal}>{children}</div>;
}

