import React, { useContext, useEffect, useState } from 'react'
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import moment from 'moment'
import { addThousandsSeparator } from '../../utilis/helper';
import InfoCard from '../../components/cards/InfoCard';
import { LuArrowLeft, LuArrowRight, LuSquarePlus } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/charts/CustomPieChart';
import CustomBarChart from '../../components/charts/CustomBarChart';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import Model from '../../components/Model';
import CreatingTask from '../../components/layouts/CreateTask';

const COLORS = ["#8D51FF", "#00BBDB", "#7BCE00"]

const AdminDashboard = () => {
    useUserAuth();
    const navigate = useNavigate();
    const {user,openCreateTaskModal, setOpenCreateTaskModal }= useContext(UserContext);
    const [currentTime, setCurrentTime] = useState(new Date().getHours());
    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    
    



  const prepareChartData=(data)=>{
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevel = data?.taskPriorityLevel || null;

    const taskDistributionData =[
      {status: "Pending", count: taskDistribution?.Pending || 0},
      {status: "In_Progress", count: taskDistribution?.In_Progress || 0},
      {status: "Completed", count: taskDistribution?.Completed || 0},
    ]

    setPieChartData(taskDistributionData);

    const priorityLevelData =[
      {priority: "Low", count: taskPriorityLevel?.Low || 0},
      {priority: "Medium", count: taskPriorityLevel?.Medium || 0},
      {priority: "High", count: taskPriorityLevel?.High || 0},
    ]
    setBarChartData(priorityLevelData);
  }

    const getDashboardData= async()=>{
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);

            if(response.data){
                setDashboardData(response.data)
                prepareChartData(response.data?.charts || null);
              }
        } catch (error) {
            console.error("error fetching users", error)
        }
    }

    const onSeeMore=()=>{
      navigate("/admin/tasks")
    }

    useEffect(()=>{
      getDashboardData();

      return ()=> {}
    },[]);



    useEffect(()=>{
  
      const interval = setInterval(()=>{
        setCurrentTime(new Date().getHours())
      }, 60 * 60 * 1000);
      return ()=> clearInterval(interval);
    },[])

    let greeting;

    if(currentTime < 12){
      greeting = "Good Morning";
    }else if(currentTime < 16){
      greeting = "Good Afternoon";
    }else{
      greeting = "Good Evening";
    }

    

    

  return (
   
      <AdminDashboardLayout activeMenu={"Admin Dashboard"}>

        <div className='card my-5'>
          <div className='flex items-center justify-between flex-wrap'>
            <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>{greeting} {user?.name}</h2>
            <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
              {moment().format("dddd Do MMM YYYY")}
            </p>

            </div>
            <button className='bg-blue-400 cursor-pointer rounded-md px-5 py-3 text-xs my-4 w-full sm:w-auto text-white flex items-center justify-center gap-2' onClick={()=> setOpenCreateTaskModal(true)}>

             <p>Add New Task</p>
              <LuSquarePlus className='text-sm '/>
              </button>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard 
          label="Total Tasks" 
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.All || 0
          )}
          color="bg-primary"
          />

          <InfoCard 
          label="Pending Tasks" 
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Pending || 0
          )}
          color="bg-violet-500"
          />
          <InfoCard
          label="In Progress Tasks" 
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.In_Progress || 0
          )}
          color="bg-cyan-500"
          />

          <InfoCard 
          label="Completed Tasks" 
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Completed || 0
          )}
          color="bg-lime-500"
          />
          </div>
        </div>


        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>


          <div>
            <div className='card'>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>Pie Chart Task Distribution</h5>
              </div>

              <CustomPieChart 
              data={pieChartData}
              colors={COLORS}
              />
            </div>
          </div>


          <div>
            <div className='card'>
              <div className='flex items-center justify-between'>
                <h5 className='font-medium'>Bar Chart Task Distribution</h5>
              </div>

              <CustomBarChart 
              data={barChartData}
              colors={COLORS}
              />
            </div>
          </div>


          <div className='md:col-span-2'>
            <div className='card'>
              <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Recent Tasks</h5>
              <button className='card-btn' onClick={onSeeMore}>
                See All <LuArrowRight className='text-base'/>
              </button>
              </div>

              <TaskListTable tableData={dashboardData?.recentTasks || []}/>
            </div>
          </div>
        </div>




        <CreatingTask onClose={()=> setOpenCreateTaskModal(false)} isOpen={openCreateTaskModal}/>

      </AdminDashboardLayout>
 
  )
}

export default AdminDashboard