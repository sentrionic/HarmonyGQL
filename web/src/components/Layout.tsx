import React from 'react';
import { Wrapper } from './Wrapper';
import { NavBar } from './NavBar';

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <NavBar />
      <Wrapper>{ children }</Wrapper>
    </>
  );
};
