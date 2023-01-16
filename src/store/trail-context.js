import React from 'react';

const TrailContext = React.createContext({
  trails: {},
  pendingTrails: {},
  trailLocations: {},
  addToTrails: () => {},
  removeFromTrails: () => {},
  addToPendingTrails: () => {},
  removeFromPendingTrails: () => {},
});

export default TrailContext;
