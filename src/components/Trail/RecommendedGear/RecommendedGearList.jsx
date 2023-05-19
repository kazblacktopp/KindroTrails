import { useSelector } from 'react-redux';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import GearItem from './GearItem';
import capitaliseString from '../../../helpers/capitaliseString';

import classes from './RecommendedGearList.module.css';

function RecommendedGearList({ trailGearList }) {
	const { gearList } = useSelector(state => state.trailData);

	console.log(gearList);

	const expandIcon = faChevronDown;
	const collapseIcon = faChevronUp;
	const checkMarkIcon = faCircleCheck;

	const { title } = classes;

	function generateGearListJSX() {
		const updatedGearListJSX = [];

		for (const category in trailGearList) {
			const previewListCategory = trailGearList[category];

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
								key={gearItemTitle}
								title={gearItemTitle}
								exampleItems={gearListExamples}
								icons={{
									expand: expandIcon,
									collapse: collapseIcon,
									check: checkMarkIcon,
								}}
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
		<section>
			<h2 className={title}>Recommended Gear List</h2>
			{gearListJSX}
		</section>
	);
}

export default RecommendedGearList;
