import { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGearList } from '../../store/trailData-slice';
import { useDatabase } from '../../hooks/use-database';
import { createRecommendedGearListInputsConfig } from '../../config/newTrailFormConfig';
import Checkbox from './Checkbox';
import capitaliseString from '../../helpers/capitaliseString';
// import classes from './GearListForm.module.css';

export default function GearListForm({ onInputChange }) {
	const [gearListFormJSX, setGearListFormJSX] = useState([]);

	const {
		gearList,
		newTrailPreview: { recommendedGear },
	} = useSelector(state => state.trailData);

	const newGearList = useRef(recommendedGear);
	const gearInputs = useRef({});
	const gearItemCategories = useRef();

	const dispatch = useDispatch();

	const { queryDatabase } = useDatabase();

	const createGearItemCategories = useCallback(() => {
		let gearItems = {};
		for (const cat in gearInputs.current) {
			for (const item in gearInputs.current[cat]) {
				gearItems[item] = cat;
			}
		}
		return gearItems;
	}, []);

	const getGearListData = useCallback(async () => {
		let list = { ...gearList };

		if (Object.keys(list).length === 0) {
			list = await queryDatabase({
				queryType: 'gearList',
			});

			dispatch(updateGearList(list));
		}

		const gearListInputsConfig =
			createRecommendedGearListInputsConfig(list);

		gearInputs.current = gearListInputsConfig;
	}, [gearList, queryDatabase, dispatch]);

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
		const updatedGearListJSX = [];

		for (const category in gearInputs.current) {
			const categoryTitle = capitaliseString(category);

			const categoryItems = { ...gearInputs.current[category] };

			if (Object.keys(recommendedGear).length !== 0) {
				const catItems = recommendedGear[category];

				if (catItems.length !== 0) {
					catItems.forEach(item => {
						categoryItems[item].checked = true;
					});
				}
			}

			updatedGearListJSX.push(
				<Fragment key={category}>
					<h3>{categoryTitle}</h3>
					<div id={category}>
						{
							<Checkbox
								key={category}
								categoryItems={categoryItems}
								onChange={updateRecommendedGearList}
							/>
						}
					</div>
				</Fragment>,
			);
		}

		setGearListFormJSX(updatedGearListJSX);
	}, [recommendedGear, updateRecommendedGearList]);

	function submitGearList() {
		onInputChange(newGearList.current);
	}

	const hasLoaded = useRef(false);

	useEffect(() => {
		if (!hasLoaded.current) {
			getGearListData();

			hasLoaded.current = true;
		}

		if (Object.keys(gearInputs.current).length !== 0) {
			generateGearListFormJSX();

			gearItemCategories.current = createGearItemCategories();
		}
	}, [getGearListData, generateGearListFormJSX, createGearItemCategories]);

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
