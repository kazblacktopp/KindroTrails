import { useState } from 'react';
import useForm from '../../hooks/use-form';
import { recommendedGearListInputsConfig } from '../../config/newTrailFormConfig';
import classes from './GearListForm.module.css';

export default function GearListForm({ onInputChange }) {
	const initialGearList = {
		tent: [],
		sleepingBag: [],
		sleepingBagLiner: [],
		sleepingMat: [],
		apparel: [],
		footware: [],
		pack: [],
		cookingGear: [],
		accessories: [],
	};

	const [gearList, setGearList] = useState(initialGearList);

	const {
		tentInputs,
		sleepingBagInputs,
		sleepingBagLinerInputs,
		sleepingMatInputs,
		apparelInputs,
		footwareInputs,
		packInputs,
		cookingGearInputs,
		accessoriesInputs,
	} = recommendedGearListInputsConfig;

	const inputs = {
		renderTentInputs: useForm(tentInputs).bind(null, updateGearList),
		renderSleepingBagInputs: useForm(sleepingBagInputs).bind(
			null,
			updateGearList,
		),
		renderSleepingBagLinerInputs: useForm(sleepingBagLinerInputs).bind(
			null,
			updateGearList,
		),
		renderSleepingMatInputs: useForm(sleepingMatInputs).bind(
			null,
			updateGearList,
		),
		renderApparelInputs: useForm(apparelInputs).bind(null, updateGearList),
		renderFootwareInputs: useForm(footwareInputs).bind(
			null,
			updateGearList,
		),
		renderPackInputs: useForm(packInputs).bind(null, updateGearList),
		renderCookingGearInputs: useForm(cookingGearInputs).bind(
			null,
			updateGearList,
		),
		renderAccessoriesInputs: useForm(accessoriesInputs).bind(
			null,
			updateGearList,
		),
	};

	function updateGearList(inputObj) {
		const { name, value, type, checked } = inputObj;

		setGearList(prevGearList => {
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
		onInputChange(gearList);
	}

	return (
		<div>
			<h2>Recommended Gear List</h2>
			<div id="recommenedGearList">
				<h3>Sleeping Gear:</h3>
				<div id="sleepingGear">
					<h4>Tent</h4>
					<div id="tents">{inputs.renderTentInputs()}</div>
					<h4>Sleeping Bag</h4>
					<div id="sleepingBags">
						{inputs.renderSleepingBagInputs()}
					</div>
					<h4>Sleeping Bag Liner</h4>
					<div id="sleepingBagLiner">
						{inputs.renderSleepingBagLinerInputs()}
					</div>
					<h4>Sleeping Mat</h4>
					<div id="sleepingMat">
						{inputs.renderSleepingMatInputs()}
					</div>
				</div>
				<h3>Apparel:</h3>
				<div id="apparel">{inputs.renderApparelInputs()}</div>
				<h3>Footware:</h3>
				<div id="footware">{inputs.renderFootwareInputs()}</div>
				<h3>Pack:</h3>
				<div id="packs">{inputs.renderPackInputs()}</div>
				<h3>Cooking Gear:</h3>
				<div id="cookingGear">{inputs.renderCookingGearInputs()}</div>
				<h3>Accessories:</h3>
				<div id="accessories">{inputs.renderAccessoriesInputs()}</div>
			</div>
			<button
				className="btn btn_blue"
				type="button"
				onClick={submitGearList}
				disabled={false}
			>
				Add
			</button>
		</div>
	);
}
