import { useReducer } from 'react';
import TrailContext from './trail-context';

const initialTrailState = {
  trails: {},
  pendingTrails: {},
  trailLocations: {},
};

function trailStateReducer(state, action) {
  const updatedTrails = { ...state.trails };
  const updatedTrailLocations = { ...state.trailLocations };
  const updatedPendingTrails = { ...state.pendingTrails };

  if (action.type === 'ADD-TRAIL') {
    const { id } = action.item;

    updatedTrails[id] = action.item;

    const { country, state } = action.item;

    if (!updatedTrailLocations[country]) {
      updatedTrailLocations[country] = {
        [state]: {
          [id]: true,
        },
      };
    }

    if (!updatedTrailLocations[country][state]) {
      updatedTrailLocations[country][state] = {
        [id]: true,
      };
    }

    if (!updatedTrailLocations[country][state][id]) {
      updatedTrailLocations[country][state][id] = true;
    }
  }

  if (action.type === 'REMOVE-TRAIL') {
  }

  if (action.type === 'ADD-PENDING') {
  }

  if (action.type === 'REMOVE-PENDING') {
  }

  const updatedTrailCtx = {
    trails: updatedTrails,
    pendingTrails: updatedPendingTrails,
    trailLocations: updatedTrailLocations,
  };

  return updatedTrailCtx;
}

export default function TrailProvider({ children }) {
  const [trailState, dispatchTrailReducer] = useReducer(
    trailStateReducer,
    initialTrailState
  );

  const trailContext = {
    trails: trailState.trails,
    pendingTrails: trailState.pendingTrails,
    trailLocations: trailState.trailLocations,
    addToTrails: addToTrailsHandler,
    removeFromTrails: removeFromTrailsHandler,
    addToPendingTrails: addToPendingTrailsHandler,
    removeFromPendingTrails: removeFromPendingTrailsHandler,
  };

  function addToTrailsHandler(trailData) {
    dispatchTrailReducer({ type: 'ADD-TRAIL', item: trailData });
  }

  function removeFromTrailsHandler(trailID) {
    dispatchTrailReducer({ type: 'REMOVE-TRAIL', item: trailID });
  }

  function addToPendingTrailsHandler(pendingData) {
    dispatchTrailReducer({ type: 'ADD-PENDING', item: pendingData });
  }

  function removeFromPendingTrailsHandler(pendingID) {
    dispatchTrailReducer({ type: 'REMOVE-PENDING', item: pendingID });
  }

  return (
    <TrailContext.Provider value={trailContext}>
      {children}
    </TrailContext.Provider>
  );
}
