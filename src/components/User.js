import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import Followers from './Followers';
import { GithubContext } from '../context/context';
const User = () => {
  const { shoDetails } = React.useContext(GithubContext);

  return (
    <section className='section'>
      <Wrapper className={`section-center ${ !shoDetails && 'hideDetails'}`}>
        <Card />
        {shoDetails === true && <Followers />}
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  padding-top: 2rem;
  display: grid;
  gap: 3rem 2rem;
  width: 100%;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    &.hideDetails{
      grid-template-columns: 1fr;
    }
  }
  /* align-items: start; */
`;

export default User;