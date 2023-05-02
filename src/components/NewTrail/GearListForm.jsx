import {
	Fragment,
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGearList } from '../../store/trailData-slice';
import { useDatabase } from '../../hooks/use-database';
import Spinner from '../UI/Spinner/Spinner';
import { createRecommendedGearListInputsConfig } from '../../config/newTrailFormConfig';
import Checkbox from './Checkbox';
// import classes from './GearListForm.module.css';

export default function GearListForm({ onInputChange }) {
	const initialGearList = {
		tent: [],
		sleepingBag: [],
		sleepingBagLiner: [],
		sleepingMat: [],
		pillows: [],
		apparel: [],
		footware: [],
		pack: [],
		cookingGear: [],
		accessories: [],
	};

	const [newGearList, setNewGearList] = useState(initialGearList);

	const [gearInputs, setGearInputs] = useState({});

	const dispatch = useDispatch();

	const { gearList } = useSelector(state => state.trailData);

	const {
		queryDatabase,
		isLoading,
		// error
	} = useDatabase();

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

	useEffect(() => {
		if (!hasLoaded.current) {
			getGearListData();
			hasLoaded.current = true;
		}
	}, [getGearListData]);

	const gearListFormJSX = useMemo(() => [], []);

	const generateGearListFormJSX = useCallback(() => {
		for (const category in gearInputs) {
			const categoryTitle = category
				.split('_')
				.map(el => {
					return el[0].toUpperCase() + el.substring(1);
				})
				.join(' ');

			gearListFormJSX.push(
				<Fragment>
					<h3>{categoryTitle}</h3>
					<div id={category}>
						{
							<Checkbox
								key={category}
								itemCategory={gearInputs[category]}
								onInputChange={updateRecommendedGearList}
							/>
						}
					</div>
				</Fragment>,
			);
		}
	}, [gearInputs, gearListFormJSX]);

	useEffect(() => {
		if (Object.keys(gearInputs).length !== 0) {
			generateGearListFormJSX();
		}
	}, [gearInputs, generateGearListFormJSX]);

	function updateRecommendedGearList(inputObj) {
		const { name, value, type, checked } = inputObj;

		setNewGearList(prevGearList => {
			const gearItemArray = prevGearList[name];

			const itemIndex = gearItemArray.indexOf(value);

			if (type === 'checkbox' && !checked) {
				if (itemIndex > -1) {
					gearItemArray.splice(itemIndex, 1);
				}
			}

			if (type === 'checkbox' && checked) {
				if (itemIndex === -1) {
					gearItemArray.push(value);
				}
			}

			const updatedGearList = {
				...prevGearList,
				[name]: gearItemArray,
			};

			return updatedGearList;
		});
	}

	function submitGearList() {
		onInputChange(newGearList);
	}

	return (
		<Fragment>
			{isLoading && <Spinner />}
			{!isLoading && (
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
			)}
		</Fragment>
	);
}
