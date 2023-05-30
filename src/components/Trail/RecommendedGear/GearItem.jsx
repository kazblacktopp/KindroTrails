import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductExample from './ProductExample';

import classes from './GearItem.module.css';

function GearItem({ exampleItems = null, title, icons }) {
	const [isActive, setIsActive] = useState(false);

	function handleToggleExamples(event) {
		event.preventDefault();

		setIsActive(prevState => !prevState);
	}

	const gearItemExamplesJSX = [];

	let hasExamples = false;

	if (exampleItems) {
		hasExamples = true;

		for (const itemExample in exampleItems) {
			const item = exampleItems[itemExample];
			const itemTitle = item.productTitle;

			gearItemExamplesJSX.push(
				<ProductExample key={itemTitle} item={item} show={isActive} />,
			);
		}
	}

	const { expand, collapse, check } = icons;

	const {
		gear_item_header,
		gear_item_examples,
		gear_icon,
		gear_item_title,
		show,
	} = classes;

	const icon = (
		<FontAwesomeIcon
			icon={!isActive ? expand : collapse}
			className={gear_icon}
			onClick={handleToggleExamples}
		/>
	);

	const examplesClasses = `${gear_item_examples} ${isActive ? show : ''}`;

	return (
		<Fragment>
			<div key={title} className={gear_item_header}>
				<div>
					<FontAwesomeIcon icon={check} />
					<span className={gear_item_title}>{title}</span>
				</div>
				{hasExamples && icon}
			</div>
			<div className={examplesClasses}>{gearItemExamplesJSX}</div>
		</Fragment>
	);
}

export default GearItem;
