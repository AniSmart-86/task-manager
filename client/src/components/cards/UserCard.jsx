import React from 'react'

const UserCard = ({userInfo}) => {
  return (
    <div className='user-card p-2'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <img
                 src={userInfo?.profileImageUrl}
                  alt="avatar-img" className='w-12 h-12 rounded-full border-2 border-white' />

                  <div>
                    <p className='text-sm font-medium'>{userInfo?.name}</p>
                    <p className='text-xs text-gray-500'>{userInfo?.email}</p>
                  </div>
            </div>
        </div>
        <div className='flex items-end gap-3 mt-5'>
            <StatCard 
            label="Pending"
            count={userInfo?.pendingTasks || 0}
            status="Pending" />

            <StatCard 
            label="In Progress"
            count={userInfo?.inProgressTasks || 0}
            status="In_Progress" />

            <StatCard 
            label="Completed"
            count={userInfo?.completedTasks || 0}
            status="Completed" />
        </div>
    </div>
  )
}

export default UserCard



const StatCard = ({label, count, status})=>{
      const getStatusTagColor=(status)=>{
        switch (status){
            case 'In_Progress': return 'bg-cyan-50 text-cyan-500 border border-cyan-500/10';
            case 'Completed': return 'bg-lime-500 text-lime-500 border border-lime-500/20';
            case 'Pending': return 'bg-purple-100 text-purple-500 border border-purple-200';
            default: return 'bg-violet-50 text-violet-500 border border-violet-500';
        }
    }

    return (
        <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-1 rounded`}>
            <span className='text-[12px] font-semibold'>{count}</span> <br /> {label}
            </div>
    )
}