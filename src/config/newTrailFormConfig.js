import { recommendedGearListInputsData } from './newTrailFormData';
import InputField from '../components/UI/Inputs/InputField';

export const recommendedGearListInputsConfig = createCheckboxInputConfig(
	recommendedGearListInputsData,
);

function createCheckboxInputConfig(inputsObject) {
	let newObj = {};

	for (const inputID in inputsObject) {
		inputsObject[inputID].forEach(inputObj => {
			const {
				label,
				name,
				value,
				renderLabelAfterInput = true,
			} = inputObj;

			let { id } = inputObj;

			if (!id) {
				id = value;
			}

			newObj[inputID] = {
				...newObj[inputID],
				[value]: {
					...createFormFieldConfig(
						label,
						name,
						'checkbox',
						id,
						value,
						renderLabelAfterInput,
					),
				},
			};
		});
	}

	return newObj;
}

function createFormFieldConfig(
	label,
	name,
	type,
	id = null,
	defaultValue = '',
	labelAfterInput = false,
) {
	if (!id && type !== 'radio') {
		id = name;
	}

	if (!id && type === 'radio') {
		// create camelCase version of label and assign to id
		id = label
			.split(' ')
			.map((el, i) => {
				let newEl = el.toLowerCase();

				if (i !== 0) {
					newEl = newEl[0].toUpperCase() + newEl.split(1);
				}

				return newEl;
			})
			.join('');
	}

	return {
		renderInput: (handleChange, value, isValid, isChecked, error, key) => {
			return (
				<InputField
					key={key}
					label={label}
					type={type}
					id={id}
					name={name}
					value={value}
					handleChange={handleChange}
					errorMessage={error}
					isValid={isValid}
					isChecked={isChecked}
					renderLabelAfterInput={labelAfterInput}
				/>
			);
		},
		label,
		name,
		value: defaultValue,
		valid: false,
		errorMessage: '',
		touched: false,
		type: type,
		checked: false,
	};
}
