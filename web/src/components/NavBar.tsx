import React from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { SearchBar } from './SearchBar';

export const NavBar: React.FC = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const router = useRouter();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;
  let navlinks = null;

  if (loading) {

  } else if (!data?.me) {
    body = (
      <>
        <a className='p-2 text-dark' href={ '/login' }>Login </a>
        <a className='btn btn-outline-primary' href={ '/register' }>Register</a>
      </>
    );
  } else {
    navlinks = (
      <>
        <h5 className="my-0 mr-md-auto font-weight-normal">
          <a className="p-2 text-dark" href="/followed">Followed Posts</a>
          <a className="p-2 text-dark" href="/liked">Liked Posts</a>
        </h5>
      </>
    );
    body = (
      <div className="navbar-nav dropdown d-xl-flex d-lg-flex d-md-flex d-sm-none d-none">
        <a className="nav-link text-dark" style={ { 'cursor': 'pointer' } }
           data-toggle="dropdown"
           aria-haspopup="true"
           aria-expanded="false">
          Account
        </a>
        <div className="dropdown-menu dropdown-primary mr-lg-5 mr-md-5"
             aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item" href={ `/${ data.me.username }` }>My Profile</a>
          <a className="dropdown-item" href="/account">Edit Profile</a>
          <a className="dropdown-item" style={ { cursor: 'pointer' } }
             onClick={ async () => {
               await logout();
               const result = await apolloClient.resetStore();
               await router.push('/');
             } } aria-disabled={ logoutFetching }>Logout</a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">

      <h4 className="my-0 mr-md-auto font-weight-normal">
        <a className="p-2 text-dark" href="/">Harmony</a>
      </h4>
      { navlinks }
      <SearchBar />
      <nav className="my-2 my-md-0 mr-md-3">
        { body }
      </nav>
    </div>
  );
};
