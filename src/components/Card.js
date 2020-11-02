import React from 'react';
import { GithubContext } from '../context/context';
import styled from 'styled-components';
import { MdBusiness, MdLocationOn, MdLink } from 'react-icons/md';
const Card = () => {
  const { githubUser, githubSearchedUsers, searchGithubUser, shoDetails } = React.useContext(GithubContext);
  const {
    avatar_url,
    html_url,
    company,
    blog,
    bio,
    location,
    login,
  } = githubUser;

  return (
    <Wrapper attr={githubSearchedUsers.total_count} className={`${!shoDetails && 'gridHeader'}`}>
      {
        shoDetails ?
        <><header>
          <img src={avatar_url} alt={login} />
          <div>
            <h4>{login}</h4>
            <p>@{login || 'Achaari Jaouad'}</p>
          </div>
          <div className="actions">
            <a href={html_url}>follow</a>
          </div>
        </header>
        <p className='bio'>{bio}</p>
        <div className='links'>
          <p>
            <MdBusiness /> {company}
          </p>
          <p>
            <MdLocationOn /> {location || 'earth'}
          </p>
          <a href={`https://${blog}`}>
            <MdLink />
            {blog}
          </a>
        </div></>
        :
        githubSearchedUsers.items.map(user => (
          <header key={user.id}>
            <img src={user.avatar_url} alt={user.login} />
            <div>
              <h4>{user.login}</h4>
              <p>@{user.login || 'Achaari Jaouad'}</p>
            </div>
            <div className="actions">
              <a href={user.html_url}>follow</a>
              <span onClick={ () => searchGithubUser(user.login)}>Details</span>
            </div>
          </header>
        ))
      }
    </Wrapper>
  );
};
const Wrapper = styled.article`
  background: var(--clr-grey-2);
  padding: 1.5rem 2rem;
  border-top-right-radius: var(--radius);
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  position: relative;
  &.gridHeader{
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 0.5rem;
    width: 100%;
    &::before {
      content: 'users';
    }
  }

  &::before {
    content: 'user';
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    background: var(--clr-grey-2);
    color: var(--clr-grey-5);
    border-top-right-radius: var(--radius);
    border-top-left-radius: var(--radius);
    text-transform: capitalize;
    padding: 0.5rem 1rem 0 1rem;
    letter-spacing: var(--spacing);
    font-size: 1rem;
  }
  header {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    column-gap: 1rem;
    margin-bottom: 1rem;
    border-radius: 15px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.6s ease;
    &:hover{
      background-color: var(--clr-grey-1);
    }
    img {
      width: 75px;
      height: 75px;
      border-radius: 50%;
    }
    h4 {
      margin-bottom: 0.25rem;
    }
    p {
      margin-bottom: 0;
    }
    .actions{
      display: flex;
      justify-content: space-between;
      & span{
        margin-left: 10px;
      }
    }
    a, span {
      color: var(--clr-primary-5);
      border: 1px solid var(--clr-primary-5);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
      transition: var(--transition);
      cursor: pointer;
      &:hover {
        background: var(--clr-primary-5);
        color: var(--clr-white);
      }
    }
  }
  .bio {
    color: var(--clr-grey-3);
  }
  .links {
    p,
    a {
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      svg {
        margin-right: 0.5rem;
        font-size: 1.3rem;
      }
    }
    a {
      color: var(--clr-primary-5);
      transition: var(--transition);
      svg {
        color: var(--clr-grey-5);
      }
      &:hover {
        color: var(--clr-primary-3);
      }
    }
  }
`;
export default Card;