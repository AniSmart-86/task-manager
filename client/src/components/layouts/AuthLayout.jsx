import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='container'>

            <h2 className='text-2xl font-bold text-emerald-400 p-5'>Smart Task Manager</h2>
        <div className='flex items-center justify-center h-screen w-screen md:w-[60w] px-2 pt-8 bg-blue-400 bg-[url("/sign-up-img.png")] bg-cover bg-no-repeat bg-center overflow-auto p-8'>
            {children}
        </div>

       
    </div>
  )
}

export default AuthLayout