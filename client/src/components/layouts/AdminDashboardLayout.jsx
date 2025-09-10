import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext';
import NavBar from '../header/NavBar';
import SideBar from '../header/SideBar';

const AdminDashboardLayout = ({children, activeMenu}) => {

  
    const {user }= useContext(UserContext);
   

  return (
    <div>
        <NavBar activeMenu={activeMenu} />

        {user &&(
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideBar activeMenu={activeMenu}/>
                </div>

                <div className='grow mx-5'>{children}</div>
            </div>
        )}
    </div>
  )
}

export default AdminDashboardLayout