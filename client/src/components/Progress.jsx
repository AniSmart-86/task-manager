import React from 'react'

const Progress = ({status, progress}) => {

       const getColor=()=>{
        switch (status){
            case 'Completed': return 'bg-emerald-400 text-white border border-emerald-500/20';

            case 'In_Progress': return 'bg-emerald-400 text-cyan-500 border border-emerald-400/10';

            default: return 'bg-violet-100 text-violet-500 border border-violet-500/10';
        }
    }


   
  return (
    <div className='w-full bg-gray-200 rounded-full h-1.5'>
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`}
         style={{width: `${progress}%`}}></div>
    </div>
  )
}

export default Progress