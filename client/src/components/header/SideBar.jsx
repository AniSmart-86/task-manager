import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import { SIDE_BAR_DATA, USER_SIDE_BAR_DATA } from '../../utilis/data';
import { useNavigate} from 'react-router-dom';


const SideBar = ({activeMenu}) => {
    const { user, clearUser} = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);
      const navigate = useNavigate();



    const handleClick=(route)=>{
        if(route === "login"){
            handleLogout();
            return;
        }

        navigate(route);
    }

    const handleLogout=()=>{
        localStorage.clear();
        clearUser();
        navigate("/login")
    }




    useEffect(()=>{
        if(user){
            setSideMenuData(user?.role === 'admin' ? SIDE_BAR_DATA : USER_SIDE_BAR_DATA);

        }
        return ()=>{}
    },[user]);

  return (
    <>
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
        <div className='flex flex-col items-center justify-center mb-7 pt-5'>
            <div className='relative'>
                <img 
                src={user?.profileImageUrl || null} 
                alt="profile image" className='w-20 h-20 bg-slate-400 rounded-full' />
            </div>

            {user?.role === "admin" &&(
                <div className='text-[10px] font-medium text-white bg-primary px-4 py-1 rounded mt-1'>
                    Admin
                </div>
            )}

            <h5 className='text-gray-900 font-bold leading-6 mt-3'>{user?.name || ""}</h5>
            <p className='text-[12px] text-gray-500'>{user?.email || ""}</p>
        </div>

        {sideMenuData.map((item, id)=>(
            <button key={`menu_${id}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
                activeMenu == item.label ? "text-primary bg-linear-to-r from-blue-100/50 border-r-3" : ""} py-3 px-6 mb-3 cursor-pointer`}
                onClick={()=>{ handleClick(item.path) }}>
                  <item.icon/>
                    {item.label}
            </button>
        ))}


    </div>
   
     </>
  )
}

export default SideBar