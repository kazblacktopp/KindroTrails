import icons from '../../../assets/icons.svg';
import classes from './Spinner.module.css';

export default function Spinner(props) {
	const { spinner } = classes;

	return (
		<div className="spinner">
			<svg className={spinner}>
				<use href={`${icons}#icon-loader`}></use>
			</svg>
		</div>
	);
}
