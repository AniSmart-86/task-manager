import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhoto from '../../components/layouts/ProfilePhoto';
import axiosInstance from '../../utilis/axiosInstance';
import { API_PATHS } from '../../utilis/apiPaths';
import { UserContext } from '../../context/userContext';
import { Link, useNavigate } from 'react-router-dom';
import uploadImage from '../../utilis/uploadImage';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utilis/helper';
import toast from 'react-hot-toast';
import { LuLoader } from 'react-icons/lu';

const SignUp = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullname] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
   const { updateUser} = useContext(UserContext)
  const navigate = useNavigate();



const handleSignUp = async(e)=>{
    e.preventDefault();
  setLoading(true)
  let profileImageUrl = '';

    if(!fullname){
      setError("Please enter your full name");
      setLoading(false)
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      setLoading(false)
      return;
    }

    if(!password){
      setError("Please enter the password")
      setLoading(false)
      return;
    }

    setError("");


    try {

      if(profilePic){
        const imageUploadder = await uploadImage(profilePic);
        profileImageUrl = imageUploadder.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        adminInviteToken: adminToken,
        profileImageUrl
      },
    
    );

    console.log(response.data);
      const { token, role } = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        if(role === "admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }
        toast.success("Signed in successfully");
      }
    } catch (error) {
        if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Something went wrong, please check your internet connection");
      }
    }finally{
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className='rounded-3xl lg:w-[80%] h-auto md:h-full border border-gray-200/50 shadow-2xl backdrop-blur-md mt-10 md:mt-0 flex flex-col justify-center p-10'>
        <h3 className='text-3xl font-bold leading-6'>Create an Account</h3>
        <p className='p-3 text-sm text-gray-500'>Join us today by entering your details below.</p>
      
      <form onSubmit={handleSignUp}>
        <ProfilePhoto image={profilePic || ""} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>


           <Input value={fullname}
                  onChange={({target})=> setFullname(target.value)}
                  label={"Full Name"}
                  
                  placeholder={"smart"}
                  type={"text"}
                   className='w-full bg-transparent outline-none'
                   />
                  

   
                    <Input value={email}
          onChange={({target})=> setEmail(target.value)}
          label={"Email Address"}
          placeholder={"example@gmail.com"}
          type={"email"}
          className='w-full bg-transparent outline-none'
          />
       
        
            <Input value={password}
                  onChange={({target})=> setPassword(target.value)}
                  label={"Password"}
                  placeholder={"min 8 characters"}
                  type={"password"}/>


            <Input value={adminToken}
                  onChange={({target})=> setAdminToken(target.value)}
                  label={"Admin Invite Token: 424242"}
                  placeholder={"(Optional)"}
                  type={"password"}/>


                    {error && <p className='text-red-500 text-[13.8px] pb-2.5'>{error}</p> }
                  <button type='submit' className='btn-primary ' disabled={loading}>
                              {loading ? (
                                <div className='flex items-center justify-center'>
                             <p> Signing in...</p> 
                                <LuLoader className='w-5 h-5 inline-block ml-3 animate-spin'/>
                                </div>
                              ): 
                              <p className='text-sm font-medium'>SIGN UP</p>
                              }
                              
                              </button>
                          <p className='text-[15px] text-slate-800 mt-3'>
                            Alredy have an account? {""}
                            <Link className='font-medium text-[14px] text-primary underline' to={"/login"}>Login</Link>
                          </p>
        </div>
      </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp