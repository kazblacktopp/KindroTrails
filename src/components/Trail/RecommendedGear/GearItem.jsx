import { Fragment, useState } from 'react';
import ProductExample from './ProductExample';

import classes from './GearItem.module.css';

function GearItem({ exampleItems = null, title }) {
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

			gearItemExamplesJSX.push(<ProductExample item={item} />);
		}
	}

	const { gear_item_header } = classes;

	return (
		<Fragment>
			<div key={title} className={gear_item_header}>
				<h4>[✓] {title}</h4>
				{hasExamples && (
					<button onClick={handleToggleExamples}>
						Show examples
					</button>
				)}
			</div>
			{isActive && gearItemExamplesJSX}
		</Fragment>
	);
}

export default GearItem;
