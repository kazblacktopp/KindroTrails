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
				<ProductExample key={itemTitle} item={item} />,
			);
		}
	}

	const { expand, collapse, check } = icons;

	const { gear_item_header, gear_item_examples, gear_icon, gear_item_title } =
		classes;

	const icon = (
		<FontAwesomeIcon
			icon={!isActive ? expand : collapse}
			className={gear_icon}
			onClick={handleToggleExamples}
		/>
	);

	return (
		<Fragment>
			<div key={title} className={gear_item_header}>
				<div>
					<FontAwesomeIcon icon={check} />
					<span className={gear_item_title}>{title}</span>
				</div>
				{hasExamples && icon}
			</div>
			{isActive && (
				<div className={gear_item_examples}>{gearItemExamplesJSX}</div>
			)}
		</Fragment>
	);
}

export default GearItem;
