import React, { useContext } from 'react'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import PrivateRoute from './routes/PrivateRoute'
import ManageTasks from './pages/Admin/ManageTasks'
import ManageUser from './pages/Admin/ManageUser'
import UserDashboard from './pages/User/UserDashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import MyTasks from './pages/User/MyTasks'
import TaskDetails from './pages/User/TaskDetails'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import UserProvider, { UserContext } from './context/userContext'
import { Toaster } from "react-hot-toast"
import { LuLoader } from 'react-icons/lu'




function App() {
 
  return (
    <>
        <UserProvider>
          <Toaster position="top-right" reverseOrder={false} />
  
        <Router>
          <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/signUp' element={<SignUp/>} />

          {/* admin routes */}
          <Route  element={<PrivateRoute allowedRoles={"admin"}/>}>
              </Route>
                <Route path='/admin/dashboard' element={<AdminDashboard/>} />
                <Route path='/admin/tasks' element={<ManageTasks/>} />
                <Route path='/admin/users' element={<ManageUser/>} />
              
              {/* user route */}
               <Route  element={<PrivateRoute allowedRoles={"admin"}/>}>
               </Route>
               <Route path='/user/dashboard' element={<UserDashboard/>} />
               <Route path='/user/my-tasks' element={<MyTasks/>} />
               <Route path='/user/task-details/:id' element={<TaskDetails/>} />
               
        {/* default route */}
        <Route path="/" element={<Root />} />
          </Routes>
        </Router>

        </UserProvider>
  
      
    </>
  )
}

export default App


const Root = ()=>{
  const { user, loading} = useContext(UserContext);

 if (loading) {
    return(
      <div className="flex items-center justify-center mx-auto">
        <div className="flex items-center">
         <LuLoader className="animate-spin ml-1" />
        <div>Loading...</div>

        </div>
      </div>
        );
  }

  if(!user){
    return <Navigate to={"login"}/>
  }else{

    return user.role === "admin" ? <Navigate to={"/admin/dashboard"} /> : <Navigate to={"/user/dashboard"}/>
  }
}
