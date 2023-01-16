import { Fragment } from 'react';
import { useDatabase } from '../../hooks/use-database';
import classes from './SearchOptions.module.css';

export default function SearchOptions(props) {
  const { queryDatabase, isLoading, error } = useDatabase();

  const { search_container_outer, search_container_inner, search_btn, soon } =
    classes;

  const countryBtnClasses = `btn btn_green ${search_btn}`;
  const nameBtnClasses = `btn_blue ${search_btn} ${soon}`;
  const gradeBtnClasses = `btn_red ${search_btn} ${soon}`;

  async function searchCountryHandler() {
    const countryList = await queryDatabase(null, 'country');
  }

  let searchPageContent = (
    <Fragment>
      <button className={countryBtnClasses} onClick={searchCountryHandler}>
        Search By Country
      </button>
      <button className={nameBtnClasses}>Search By Trail Name</button>
      <button className={gradeBtnClasses}>Search By Grade</button>
    </Fragment>
  );

  return (
    <div className={search_container_outer}>
      <h2>Search for a trail:</h2>
      <div className={search_container_inner}>{searchPageContent}</div>
    </div>
  );
}
