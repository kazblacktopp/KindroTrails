import classes from './RecommendedGearList.module.css';

function RecommendedGearList({ gearList }) {
	// console.log(Object.keys(gearList));

	function generateGearListJSX() {
		const updatedGearList = [];

		for (const category in gearList) {
			const categoryTitle = category
				.split('_')
				.map(el => {
					return el[0].toUpperCase() + el.substring(1);
				})
				.join(' ');

			updatedGearList.push(
				<div key={category}>
					<h3>{categoryTitle}</h3>
				</div>,
			);
		}

		return updatedGearList;
	}

	const gearListJSX = generateGearListJSX();

	const { title } = classes;

	return (
		<div>
			<h2 className={title}>Recommended Gear List</h2>
			{gearListJSX}
		</div>
	);
}

export default RecommendedGearList;
