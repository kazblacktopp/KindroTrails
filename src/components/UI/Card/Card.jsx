import classes from './Card.module.css';

function Card({ styles, children }) {
	const { card } = classes;
	const cardClasses = styles ? `${styles} ${card}` : card;
	return <div className={cardClasses}>{children}</div>;
}

export default Card;

