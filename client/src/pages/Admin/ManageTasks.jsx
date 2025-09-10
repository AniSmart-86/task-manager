import React, { useContext, useEffect, useState } from 'react'
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout'
// import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/cards/TaskCard';
import { UserContext } from '../../context/userContext';
import CreatingTask from '../../components/layouts/CreateTask';

const ManageTasks = () => {
  const [allTasks, setAllTasks]= useState([]);
  const [tabs, setTabs]= useState([])
  const [filterStatus, setFilterStatus]= useState("All");
 const {openCreateTaskModal, setOpenCreateTaskModal, handleClick }= useContext(UserContext);
  // const navigate = useNavigate();

  const getAlltasks = async()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS,{
        params:{
          status: filterStatus === "All" ? "" : filterStatus,
        }
    });
    setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
    console.log(allTasks);
    const statusSummary = response.data?.statusSummary || {};

    const statusArray = [
      {label: "All", count: statusSummary.all || 0},
      {label: "Pending", count: statusSummary.pendingTasks || 0},
      {label: "In_Progress", count: statusSummary.inProgressTasks || 0},
      {label: "Completed", count: statusSummary.completedTasks || 0}
    ]
    setTabs(statusArray);
    } catch (error) {
      console.error("error fetch users task", error)
    }
  }


   const handleDownloadReport = async()=>{
        try {
          const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
            responseType: "blob",
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
    
          link.setAttribute("download", "task_details.xlsx");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("error downloading report", error)
          toast.error("Failed to download task details.")
        }
      }



  useEffect(()=>{
    getAlltasks(filterStatus)
    return ()=>{}
  },[filterStatus]);

  
  return (
    <AdminDashboardLayout activeMenu={"Manage Task"}>
      <div className='my-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
          <div className=''>
            <h2 className='text-sm md:text-xl font-medium'>My Tasks</h2>
          
          </div>
  <button
            className='flex download-btn justify-center my-4'
            onClick={handleDownloadReport}>
              <LuFileSpreadsheet className='text-lg'/>
              Download Report
            </button>
          {tabs[0]?.count > 0 && (
            <div>
              <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
               />

            </div>
          ) }
        </div>


          
        <div className=''>
          {allTasks?.length === 0 ? (
              <div className='flex items-center justify-center mx-auto'>
              <p className='text-muted-foreground'>No tasks available</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mx-4'>
             
              {allTasks?.map((item, index)=>(
                <TaskCard
                key={item._id || index}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((itm)=> itm.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklists={item.todoChecklists || []}
                onClick={()=> handleClick(item)}
                 />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreatingTask onClose={()=> setOpenCreateTaskModal(false)} isOpen={openCreateTaskModal}/>
    </AdminDashboardLayout>
  )
}

export default ManageTasks