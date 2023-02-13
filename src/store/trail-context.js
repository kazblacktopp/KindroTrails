import React from 'react';

const TrailContext = React.createContext({
	trails: {},
	trailIDs: {},
	trailGrades: {},
	pendingTrails: {},
	trailLocations: {},
	updateTrails: () => {},
	updateTrailIDs: () => {},
	updateTrailGrades: () => {},
	updatePendingTrails: () => {},
	updateTrailLocations: () => {},
});

export default TrailContext;
