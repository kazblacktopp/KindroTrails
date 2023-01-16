import { useState, useContext } from 'react';
import TrailContext from './store/trail-context';
import NavBar from './components/UI/Nav/NavBar';
import SearchOptions from './components/Search/SearchOptions';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';

function App() {
  const trailCxt = useContext(TrailContext);
  const [addNewTrail, setAddNewTrail] = useState(false);
  const [viewTrail, setViewTrail] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);

  // Set showAddBtn to true if user is logged in and has admin permissions
  const [showAddBtn, setShowAddBtn] = useState(true);

  function clickHomeHandler() {
    setAddNewTrail(false);
    setViewTrail(false);

    // If user is logged in and has admin permissions:
    setShowAddBtn(true);
  }

  function addNewTrailHandler() {
    setAddNewTrail(true);
    setShowAddBtn(false);
  }

  function closeNewTrailFormHandler() {
    setAddNewTrail(false);
    setShowAddBtn(true);
  }

  function viewTrailHandler(trailID) {
    const trail = trailCxt.trails[trailID];

    setSelectedTrail(trail);

    setAddNewTrail(false);
    setViewTrail(true);
  }

  let appPages;

  if (!viewTrail && !addNewTrail) {
    appPages = <SearchOptions></SearchOptions>;
  }

  if (viewTrail && !addNewTrail) {
    appPages = (
      <TrailPage
        trailData={selectedTrail}
        trailImages={selectedTrail.trailImages}
      />
    );
  }

  if (addNewTrail) {
    appPages = (
      <NewTrail
        onClose={closeNewTrailFormHandler}
        onViewTrail={viewTrailHandler}
      />
    );
  }

  return (
    <div className="app_container">
      <header className="top_header">
        <NavBar onClickHome={clickHomeHandler}></NavBar>
        {!addNewTrail && showAddBtn && (
          <button
            className="new_trail_btn btn btn_blue"
            onClick={addNewTrailHandler}
          >
            Add New Trail
          </button>
        )}
      </header>
      {appPages}
    </div>
  );
}

export default App;
