import React from 'react';

const TrailContext = React.createContext({
	trails: {},
	gearList: {},
	trailIDs: {},
	trailGrades: {},
	pendingTrails: {},
	trailLocations: {},
	updateTrails: () => {},
	updateGearList: () => {},
	updateTrailIDs: () => {},
	updateTrailGrades: () => {},
	updatePendingTrails: () => {},
	updateTrailLocations: () => {},
});

export default TrailContext;
