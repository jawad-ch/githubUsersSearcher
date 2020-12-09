import React, { useState, useEffect, useCallback } from 'react';
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

    const getSearchedUsers = (query) => {
      setIsLoading(true);
        axios(`${rootSearchUrl}${query}`).then((res) =>{
          if(res.data.total_count > 0){
            toggleError();
            setDetails(false)
            setSearchedUsers(res.data)
          }else{
            searchGithubUser(githubUser.login);
            toggleError(true, 'there is no user with that query');
          }
          setIsLoading(false);
        }).catch((err) =>
          console.log(err)
        );
    }

          //  check rate
          const checkRequests = useCallback(() => {
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
        }, []);

    const searchGithubUser =  useCallback((user) => {
        toggleError();
        setIsLoading(true);
        setDetails(true);

        axios(`${rootUrl}/users/${user}`).then((response) => {
          if (response) {
            setGithubUser(response.data);
            const { login, followers_url } = response.data;
      
            axios.all([axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),axios.get(`${followers_url}?per_page=100`)]).then(
              axios.spread((...responses) => {
                const repos = responses[0];
                const followers = responses[1];
                setRepos(repos.data);
                setFollowers(followers.data);
              })
            ).catch((err) => console.log(err));
          } else {
            toggleError(true, 'there is no user with that username');
          }
          checkRequests();
          setIsLoading(false);
        }).catch((err) =>
          console.log(err)
        );
        
    }, [checkRequests]);

    useEffect(checkRequests, [checkRequests])
    useEffect(() =>{ searchGithubUser('jawad-ch') }, [searchGithubUser])

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