import React, { useState } from 'react'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentInput = ({attachments, setAttachments}) => {

    
    
        const [option, setOption] = useState("");
    
    
        const handleAddOption = ()=>{
            if(option.trim()){
                setAttachments([...attachments, option.trim()]);
                setOption("");
            }
        }
    
        const handleDeleteOption = (index)=>{
            const updatedArr = attachments.filter((_, idx)=> idx !== index);
            setAttachments(updatedArr);
        }
  return (
    <div>
        {attachments?.map((item,index)=>(
            <div className='flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'
            key={item}>
                <div className='flex-1 flex items-center gap-3 border border-gray-100'>
                    <LuPaperclip className='text-gray-400'/>
                    <p className='text-xs text-black'>{item}</p>
                </div>

                <button
                className='cursor-pointer'
                onClick={()=> handleDeleteOption(index)}>
                    <HiOutlineTrash className='text-lg text-red-500'/>
                </button>
            </div>
        ))}

        <div className='flex items-center gap-5 mt-4'>
            <div className='flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>
                <LuPaperclip className='text-gray-400'/>

                <input type="text" 
                value={option}
                 placeholder='Add a file link' 
                className='w-full text-[13px] text-black outline-none bg-white py-2'
                onChange={({target})=> setOption(target.value)}
                />

                <button
                 className='card-btn text-nowrap'
                 onClick={handleAddOption}>
                <HiPlus className='text-md'/> Add
                 </button>
            </div>
        </div>
    </div>
  )
}

export default AddAttachmentInput