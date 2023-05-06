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
	recommendedGear: {},
};

export default initialTrailState;
