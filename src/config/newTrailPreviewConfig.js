const initialTrailState = {
	title: '',
	description: '',
	infoUrl: '',
	country: '',
	state: '',
	facts: {
		distance: '',
		time: {
			timeAmount: '',
			timeType: '',
		},
		direction: '',
		difficulty: '',
		ownGear: '',
		environment: '',
		elevation: {
			lowest: '',
			highest: '',
		},
	},
	temperatures: {
		summer: {
			sumMin: '',
			sumMax: '',
		},
		autumn: {
			autMin: '',
			autMax: '',
		},
		winter: {
			winMin: '',
			winMax: '',
		},
		spring: {
			sprMin: '',
			sprMax: '',
		},
	},
	trailImages: [],
	recommendedGear: {
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
	},
};

export default initialTrailState;
