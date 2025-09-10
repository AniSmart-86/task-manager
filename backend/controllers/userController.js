const bcrypt = require("bcryptjs");
const User = require("../models/userModal");
const Task = require("../models/taskModal");


const getUsers = async(req,res)=>{
    try {
        const users = await User.find({role: "member"}).select("-password");


        // Add task counts to each user
        const usersWithTaskCounts = await Promise.all(users.map(async(user)=>{
            const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: "Pending"});
            const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: "In_Progress"});
            const completedTasks = await Task.countDocuments({assignedTo: user._id, status: "Completed"});

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            }
        }));

        res.json(usersWithTaskCounts);
    } catch (error) {
         res.status(500).json({message: "error getting user with tasks", error: error.message})   
    
    }
}




const getUserById = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            res.status(404).json({message: "user not found"});

        }
        res.json(user)
    } catch (error) {
         res.status(500).json({message: "error getting user by id", error: error.message})   
    
    }

}


module.exports = {getUsers, getUserById}