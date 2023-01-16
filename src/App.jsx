import { useState, useContext } from 'react';
import TrailContext from './store/trail-context';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';

function App() {
  const trailCxt = useContext(TrailContext);
  const [addNewTrail, setAddNewTrail] = useState(false);
  const [viewTrail, setViewTrail] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);

  function addNewTrailHandler() {
    setAddNewTrail(true);
  }

  function closeNewTrailFormHandler() {
    setAddNewTrail(false);
  }

  function viewTrailHandler(trailID) {
    const trail = trailCxt.trails[trailID];

    setSelectedTrail(trail);

    setAddNewTrail(false);
    setViewTrail(true);
  }

  return (
    <div className="app_container">
      {!addNewTrail && (
        <button
          className="new_trail_btn btn btn_blue"
          onClick={addNewTrailHandler}
        >
          + Add New Trail
        </button>
      )}
      {viewTrail && !addNewTrail && (
        <TrailPage
          trailData={selectedTrail}
          trailImages={selectedTrail.trailImages}
        />
      )}
      {addNewTrail && (
        <NewTrail
          onClose={closeNewTrailFormHandler}
          onViewTrail={viewTrailHandler}
        />
      )}
    </div>
  );
}

export default App;
