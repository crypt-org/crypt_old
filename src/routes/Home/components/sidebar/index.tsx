import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type SideBarProps = {};

const SideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
  // if (!state.isAuthenticated) {
  //   return (<Redirect to="/" />);
  // }

  return (
    <motion.div className='sidebarContainer'>
      <div>Option 1</div>
      <div>Option 2</div>
      <div>Option 3</div>
      <div>Option 4</div>
      <div>Option 5</div>
    </motion.div>
  );
};

export default SideBar;
