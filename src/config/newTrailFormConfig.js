import InputField from '../components/UI/Inputs/InputField';

function createRecommendedGearListInputsConfig(gearListData) {
	const inputs = {};

	for (const itemCategory in gearListData) {
		const category = gearListData[itemCategory];

		for (const itemSubcategory in category) {
			const itemData = {
				label: createInputLabel(itemSubcategory),
				name: itemSubcategory,
				value: itemSubcategory,
			};

			inputs[itemCategory] = {
				...inputs[itemCategory],
				[itemSubcategory]: itemData,
			};
		}
	}

	const checkboxInputConfig = createCheckboxInputConfig(inputs);

	return checkboxInputConfig;
}

function createInputLabel(inputPropertyName) {
	const label = inputPropertyName
		.split('_')
		.map(element => {
			let el = element[0].toUpperCase() + element.substring(1);

			return el;
		})
		.join(' ');

	return label;
}

function createCheckboxInputConfig(inputsObject) {
	let newObj = {};

	for (const inputID in inputsObject) {
		const inputObj = inputsObject[inputID];

		for (const input in inputObj) {
			const {
				label,
				name,
				value,
				renderLabelAfterInput = true,
			} = inputObj[input];
			let { id } = inputObj[input];

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
		}
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

export { createRecommendedGearListInputsConfig };
