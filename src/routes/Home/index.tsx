import './HomeRoute.scss';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppSelector } from '../../services/redux/hooks';
import { RootState } from '../../services/redux/Redux';
import SideBar from './components/sidebar';

export type HomeRouteProps = {};

const HomeRoute: React.FC<HomeRouteProps> = (props: HomeRouteProps) => {
  const [state, setState] = useState({
    isAuthenticated: useAppSelector(
      (state: RootState) =>
        !!state.user.email &&
        !!state.user.name &&
        !!state.user.pub &&
        !!state.user.pub &&
        !!state.user.uid
    ),
  });

  // if (!state.isAuthenticated) {
  //   return (<Redirect to="/" />);
  // }

  return (
    <div className='homeContainer'>
      <SideBar />
      <div>Main Bar</div>
    </div>
  );
};

export default HomeRoute;
