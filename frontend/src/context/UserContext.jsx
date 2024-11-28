import { createContext, useContext, useEffect, useState } from "react";
import toast, {Toaster} from 'react-hot-toast'
import axios from 'axios';
import { server } from "../main";
const UserContext=createContext()

export const UserProvider=({children})=>{
    const [btnLoading,setBtnLoading]=useState(false);
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState([]);
    const [isAuth,setIsAuth]=useState(false);


    async function loginUser(email,navigate) {
        try {
            setBtnLoading(true);
            const {data}=await axios.post(`${server}/api/user/login`,{email});
            toast.success(data.message);
            localStorage.setItem("verifyToken",data.verifyToken);
            navigate("/verify");
            setBtnLoading(false);
           

        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
            

        }
    }

    async function verifyOtp(otp,navigate,fetchChats) {
        try {
            setBtnLoading(true);

            const verifyToken=localStorage.getItem("verifyToken");

            if(!verifyToken){
                return toast.error("No token found login again");
            }

            const {data}=await axios.post(`${server}/api/user/verify`,{otp,verifyToken});
            toast.success(data.message);
            localStorage.clear();
            localStorage.setItem("token",data.token);
            navigate("/");
            setBtnLoading(false);
            setIsAuth(true);
            setUser(data.user);
            fetchChats();
            

        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
          
        }
    }


    async function fetchUser() {
        try {
            const {data}=await axios.get(`${server}/api/user/me`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            setIsAuth(true);
            setUser(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setIsAuth(false);
            setLoading(false);
        }
    }

    const userLogout=(navigate)=>{
        localStorage.clear();
        toast.success("Logged Out Successfully");
        setIsAuth(false);
        setUser([]);
        navigate("/login");
        
    }
    useEffect(()=>{
        fetchUser();
    },[])
    return <UserContext.Provider value={{loginUser,btnLoading,isAuth,setIsAuth,verifyOtp,user,loading,userLogout}}>
        {children}
        <Toaster/>
        </UserContext.Provider>
}

export const UserData=()=>useContext(UserContext);