import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

const TaskDetails = () => {

const { id } = useParams();
const [task, setTask] = useState(null)

    const getStatusTagColor=(status)=>{
        switch (status){
            case 'Completed': return 'bg-emerald-500 text-white border border-emerald-500/20';
            // case 'Pending': return 'bg-purple-100 text-purple-500 border border-purple-200';
            case 'In_Progress': return 'bg-cyan-50 text-cyan-500 border border-cyan-500/10';
            default: return 'bg-violet-50 text-violet-500 border border-violet-500';
        }
    }

    const getTaskDetailsById = async()=>{
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

        if(response.data){
          setTask(response.data)
        }
      } catch (error) {
        console.error("error fetching users task details", error)
      }
    }



    const updateTodoChecklist = async (index) => {
  if (!task) return;

  // make a safe copy of current todoChecklists
  const updatedTodoChecklists = [...(task?.todoChecklists || [])];

  // check if index exists
  if (!updatedTodoChecklists[index]) return;

  // toggle completed state
  updatedTodoChecklists[index].completed = !updatedTodoChecklists[index].completed;

  try {
    const response = await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
      { todoChecklists: updatedTodoChecklists }
    );

    if (response.status === 200) {
      // use updated task from backend if available, else fallback to local state
      setTask(response.data?.task || { ...task, todoChecklists: updatedTodoChecklists });
    } else {
      // rollback if API fails
      updatedTodoChecklists[index].completed = !updatedTodoChecklists[index].completed;
      setTask({ ...task, todoChecklists: updatedTodoChecklists });
    }
  } catch (error) {
    console.error("Error updating todo checklist:", error);
    // rollback toggle on error
    updatedTodoChecklists[index].completed = !updatedTodoChecklists[index].completed;
    setTask({ ...task, todoChecklists: updatedTodoChecklists });
  }
};



    const handleLinkClick = (link)=>{
      if(!/^https?:\/\//i.test(link)){
        link = "https://"+link;
      }
      window.open(link, "_blank")
    }

    useEffect(()=>{
      if(id){
        getTaskDetailsById();
      }

    },[id])
  return (
    <AdminDashboardLayout activeMenu={"My Tasks"}>
      <div className='mt-5'>

        {task &&( <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-base font-medium'>
                {task?.title}
              </h2>
            <div className={`text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-1 rounded`}>
              {task?.status}
            </div>

            </div>
          <div className='mt-4'>
            <InfoBox label="Description" value={task?.description} />
          </div>

          <div className='grid grid-cols-12 gap-4 mt-4'>

             <div className='col-span-6 md:col-span-4'>
            <InfoBox label="Priority" value={task?.priority} />
          </div>
             <div className='col-span-6 md:col-span-4'>
            <InfoBox label="Due Date" value={task?.dueDate ? moment(task?.dueDate).format("Do MMM YYYY") : "N/A"} />
          </div>
             <div className='col-span-6 md:col-span-4'>
           <label className='text-xs font-medium text-slate-500'>Assigned To</label>

           <AvatarGroup avatars={task?.assignedTo?.map((item)=> item?.profileImageUrl) || []} maxVisible={5} />
          </div>

          </div>

          <div className='mt-2'>
            <label className='text-xs font-medium text-slate-500'>Todo Checklist</label>
         {task?.todoChecklists?.map((item, index)=>(
          <TodoChecklist 
          key={`todo_${index}`}
          text={item.text}
          isChecked={item?.completed}
          onChange={()=> updateTodoChecklist(index)} />
         ))}
          </div>

         {task?.attachments?.length > 0 &&(
          <div>
            <label className='text-xs font-medium text-slate-500'>Attachments</label>
            {task?.attachments?.map((link, index)=>(
              <Attachment 
              key={`link_${index}`}
              index={index}
              link={link}
              onClick={()=> handleLinkClick(link)} />
            ))}
          </div>
         )}
          </div>
        </div>
      )}

      </div>
    </AdminDashboardLayout>
  )
}

export default TaskDetails


const InfoBox = ({label, value})=>{
  return (
    <>
    <label className='text-xs font-medium text-slate-500'>{label}</label>
    <p className='text-[12px] font-medium text-gray-700 mt-1'>{value}</p>
    </>
  )
}



const TodoChecklist = ({text, isChecked, onChange})=>{
  return (
    <div className='flex items-center gap-3 p-3'>
      <input type="checkbox" 
      checked={isChecked}
      onChange={onChange}
      className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer' 
      />
      <p className='text-[13px] text-gray-800'>{text}</p>
    </div>
  )
}


const Attachment = ({link, index, onClick})=>{
  return(
    <div className='flex justify-between bg-gray-50 border border-gray-100 px-3 rounded-md mt-2 cursor-pointer'
    onClick={onClick}>
      <div className='flex-1 flex items-center gap-3'>
        <span className='text-xs text-gray-400 font-semibold mr-2'>
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className='text-xs text-black'>{link}</p>
      </div>

      <LuSquareArrowOutUpRight className='text-gray-400'/>
    </div>
  )
}