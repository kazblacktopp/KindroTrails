import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGearList } from '../../store/trailData-slice';
import { useDatabase } from '../../hooks/use-database';
import { createRecommendedGearListInputsConfig } from '../../config/newTrailFormConfig';
import Checkbox from './Checkbox';
// import classes from './GearListForm.module.css';

export default function GearListForm({ onInputChange }) {
	const initialGearList = {
		tents: [],
		sleeping_bags: [],
		sleeping_bag_liners: [],
		sleeping_mats: [],
		pillows: [],
		apparel: [],
		footware: [],
		packs: [],
		cooking_gear: [],
		accessories: [],
	};

	const [gearInputs, setGearInputs] = useState({});
	const [gearListFormJSX, setGearListFormJSX] = useState([]);
	const newGearList = useRef(initialGearList);
	const gearItemCategories = useRef();

	const dispatch = useDispatch();

	const { gearList } = useSelector(state => state.trailData);

	const { queryDatabase } = useDatabase();

	const createGearItemCategories = useCallback(() => {
		let gearItems = {};
		for (const cat in gearInputs) {
			for (const item in gearInputs[cat]) {
				gearItems[item] = cat;
			}
		}
		return gearItems;
	}, [gearInputs]);

	const getGearListData = useCallback(async () => {
		let list = gearList;

		if (Object.keys(list).length === 0) {
			list = await queryDatabase({
				queryType: 'gearList',
			});
			dispatch(updateGearList(list));
		}

		const gearListInputsConfig =
			createRecommendedGearListInputsConfig(list);

		setGearInputs(gearListInputsConfig);
	}, [gearList, queryDatabase, dispatch]);

	const hasLoaded = useRef(false);

	const updateRecommendedGearList = useCallback(inputObj => {
		const { name, value, type, checked } = inputObj;

		const itemCategory = gearItemCategories.current[name];

		const gearItemArray = [...newGearList.current[itemCategory]];

		const itemIndex = gearItemArray.indexOf(value);

		if (type === 'checkbox' && checked) {
			if (itemIndex === -1) {
				gearItemArray.push(value);
			}
		}

		if (type === 'checkbox' && !checked) {
			if (itemIndex > -1) {
				gearItemArray.splice(itemIndex, 1);
			}
		}

		newGearList.current = {
			...newGearList.current,
			[itemCategory]: gearItemArray,
		};
	}, []);

	const generateGearListFormJSX = useCallback(() => {
		const updatedGearList = [];

		for (const category in gearInputs) {
			const categoryTitle = category
				.split('_')
				.map(el => {
					return el[0].toUpperCase() + el.substring(1);
				})
				.join(' ');

			updatedGearList.push(
				<Fragment key={category}>
					<h3>{categoryTitle}</h3>
					<div id={category}>
						{
							<Checkbox
								key={category}
								categoryItems={gearInputs[category]}
								onChange={updateRecommendedGearList}
							/>
						}
					</div>
				</Fragment>,
			);
		}

		setGearListFormJSX(updatedGearList);
	}, [gearInputs, updateRecommendedGearList]);

	function submitGearList() {
		onInputChange(newGearList.current);
	}

	useEffect(() => {
		if (!hasLoaded.current) {
			getGearListData();
			hasLoaded.current = true;
		}

		if (Object.keys(gearInputs).length) {
			generateGearListFormJSX();
			gearItemCategories.current = createGearItemCategories();
		}
	}, [
		getGearListData,
		gearInputs,
		generateGearListFormJSX,
		createGearItemCategories,
	]);

	return (
		<Fragment>
			<div>
				<h2>Recommended Gear List</h2>
				<div id="recommenedGearList">{gearListFormJSX}</div>
				<button
					className="btn btn_blue"
					type="button"
					onClick={submitGearList}
					disabled={false}
				>
					Add
				</button>
			</div>
		</Fragment>
	);
}
