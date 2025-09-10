import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utilis/axiosInstance";
import { API_PATHS } from "../utilis/apiPaths";



export const UserContext = createContext();

const UserProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
        setLoading(false);
        return;
    }

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data);
        } catch (error) {
            console.log("user not authenticated", error);
            clearUser();
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
}, []);


    const updateUser = (userData)=>{
        setUser(userData);
        localStorage.setItem("token", userData.token);
        setLoading(false);
    }

    const clearUser = ()=>{
        setUser(null);
        localStorage.removeItem("token")
    };

    const handleClick = (taskData) => {
  setEditingTask(taskData);
  setOpenCreateTaskModal(true);
};


    const value = {user, 
        loading, 
        updateUser,
         clearUser,
         openCreateTaskModal, 
         setOpenCreateTaskModal,
         handleClick,
         editingTask,
         setEditingTask
        }
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;