import React, { useState, useEffect } from 'react';
import mockUser from './mockData/mockUser';
import mockRepos from './mockData/mockRepos';
import mockFollowers from './mockData/mockFollowers';
import axios from 'axios';
import mockSearchedUsers from './mockData/mockSearchedUsers';

const rootUrl = 'https://api.github.com';
const rootSearchUrl = `${rootUrl}/search/users?q=`;

const GithubContext = React.createContext();

const GithubProvider = ({children}) => {

    const [githubUser, setGithubUser] = useState(mockUser);
    const [githubSearchedUsers, setSearchedUsers] = useState(mockSearchedUsers);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);
    // request loading
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [shoDetails, setDetails] = useState(false);
    // error
    const [error, setError] = useState({ show: false, msg: '' });
    function toggleError(show = false, msg = '') {
        setError({ show, msg });
    }

    const getSearchedUsers = async (query) => {
      setIsLoading(true);
      const searchResponse = await axios(`${rootSearchUrl}${query}`).catch((err) =>
          console.log(err)
        );
        if(searchResponse){
          if(searchResponse.data.total_count > 0){
            toggleError();
            setDetails(false)
            setSearchedUsers(searchResponse.data)
          }else{
            searchGithubUser(githubUser.login);
            toggleError(true, 'there is no user with that query');
          }
          setIsLoading(false);
        }
    }

    const searchGithubUser = async (user) => {
        toggleError();
        setIsLoading(true);
        setDetails(true);
        const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
          console.log(err)
        );
        if (response) {
          setGithubUser(response.data);
          const { login, followers_url } = response.data;
    
          await Promise.allSettled([
            axios(`${rootUrl}/users/${login}/repos?per_page=100`),
            axios(`${followers_url}?per_page=100`),
          ]).then((results) => {
              const [repos, followers] = results;
              const status = 'fulfilled';
              if (repos.status === status) {
                setRepos(repos.value.data);
              }
              if (followers.status === status) {
                setFollowers(followers.value.data);
              }
            })
            .catch((err) => console.log(err));
        } else {
          toggleError(true, 'there is no user with that username');
        }
        checkRequests();
        setIsLoading(false);
    };

      //  check rate
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
        .then(({ data }) => {
            let {
            rate: { remaining },
            } = data;
            setRequests(remaining);
            if (remaining === 0) {
                toggleError(true, 'sorry, you have exceeded your hourly rate limit!');
            }
        })
        .catch((err) => console.log(err));
    };

    useEffect(checkRequests, [])
    useEffect(() =>{ searchGithubUser('jawad-ch') }, [])

    return <GithubContext.Provider 
            value={{
                githubUser,
                repos,
                followers,
                requests,
                error,
                searchGithubUser,
                isLoading,
                getSearchedUsers,
                githubSearchedUsers,
                shoDetails
            }}
    >{children}</GithubContext.Provider>
}

export { GithubProvider, GithubContext }