import { useSelector } from 'react-redux';
import GearItem from './GearItem';
import capitaliseString from '../../../helpers/capitaliseString';

import classes from './RecommendedGearList.module.css';

function RecommendedGearList({ previewGearList }) {
	const { gearList } = useSelector(state => state.trailData);

	const { title } = classes;

	function generateGearListJSX() {
		const updatedGearListJSX = [];

		for (const category in previewGearList) {
			const previewListCategory = previewGearList[category];

			if (previewListCategory.length !== 0) {
				const categoryTitle = capitaliseString(category);
				const gearItemJSX = [];
				const gearListCategory = gearList[category];

				for (const gearItem in gearListCategory) {
					if (previewListCategory.includes(gearItem)) {
						const gearListExamples = gearListCategory[gearItem];
						const gearItemTitle = capitaliseString(gearItem);

						gearItemJSX.push(
							<GearItem
								exampleItems={gearListExamples}
								title={gearItemTitle}
							/>,
						);
					}
				}

				updatedGearListJSX.push(
					<div key={category}>
						<h3>{categoryTitle}</h3>
						{gearItemJSX}
					</div>,
				);
			}
		}
		return updatedGearListJSX;
	}

	const gearListJSX = generateGearListJSX();

	return (
		<div>
			<h2 className={title}>Recommended Gear List</h2>
			{gearListJSX}
		</div>
	);
}

export default RecommendedGearList;
