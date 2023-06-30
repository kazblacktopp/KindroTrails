import icons from '../../../assets/icons.svg';
import classes from './Spinner.module.css';

export default function Spinner() {
	const { spinner } = classes;

	return (
		<div className={spinner}>
			<svg>
				<use href={`${icons}#icon-loader`}></use>
			</svg>
		</div>
	);
}
