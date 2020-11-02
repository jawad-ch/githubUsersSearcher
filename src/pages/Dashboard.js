import React from 'react';
import { Info, Repos, User, Search, NavBar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext } from '../context/context';
const Dashboard = () => {
  const { isLoading, shoDetails } = React.useContext(GithubContext);
  
    return (
      <main>
        <NavBar />
        <Search />
        {
          isLoading ? (<img src={loadingImage} className='loading-img' alt='loding' />)
          :
          (
            <>
              {shoDetails && <Info /> }
              <User />
              {shoDetails &&  <Repos /> }
            </>
          )
        }
      </main>
    );
};

export default Dashboard;