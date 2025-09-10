import React, { useEffect, useState } from 'react'
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout'
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/cards/UserCard';

const ManageUser = () => {

  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if(response.data?.length > 0){
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("error fetching users", error);
    }
  }


  const handleDownloadReport = async()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("error downloading report", error);
      toast.error("Failed to download user task details.")
    }
  }


  useEffect(() => {
    getAllUsers();
  
    return () => {
      
    }
  }, [])
  

  return (
   <AdminDashboardLayout activeMenu={"Team Members"}>
    <div className='mt-5 mb-10'>
      <div className='flex md:flex-row md:items-center justify-center'>
        <h2 className='text-xl font-medium'>Team Members</h2>
        <button
        className='flex download-btn'
        onClick={handleDownloadReport}>
          <LuFileSpreadsheet className='text-lg' />
          Download Report
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
      {allUsers?.map((user)=>(
        <UserCard
        key={user._id} userInfo={user} />
      ))}
      </div>
    </div>
   </AdminDashboardLayout>
  )
}

export default ManageUser