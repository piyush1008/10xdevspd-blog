import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SigninType,SignupType } from "@piyush10xdev/medium-common";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Auth=({type}:{type:"signup" | "signin"})=>{
    const navigate=useNavigate();
    
    const [postInput,setPostInput]=useState<SignupType>({
        name:"",
        email:"",
        password:""
    })

    async function sendRequest()
    {
        try{
            const response=await axios.post(`${BACKEND_URL}/api/v1/${type==="signup" ? "signup":"signin"}`,{
                email:postInput.email,
                password:postInput.password
            });
            const jwt=response.data;
            localStorage.setItem("token",jwt.jwt);
            navigate("/blogs");
        }
        catch(error)
        {
            console.log(error);
            alert("erro while signing up");
        }
        
    }


    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="text-3xl font-bold ">
                    {type==="signin" ? "Login into your accrount" : "Create a  account"}
                </div>
                
                <div className="text-slate-400">
                    {type==="signin"? "Don't have an account" : "Already have an account?"}
                     <Link className="pl-2 underline" to={ type==="signin"? "/signup" : "/signin"}>{type==="signin"? "Signup" : "Signin"}</Link>
                </div>
                {type==="signup" ? 
                <div className="mt-4">
                    <LabelIput label="Username" placeholder="Enter your username" onChange={(e)=>{
                        setPostInput(c => ({
                            ...c,
                            name:e.target.value
                        }));
                    }}/>
                </div> : null}
                <div className="mt-4">
                    <LabelIput label="Email" placeholder="Enter your email" onChange={(e)=>{
                        setPostInput(c => ({
                            ...c,
                            email:e.target.value
                        }));
                    }}/>
                </div>
                <div className="mt-4">
                    <LabelIput label="Password" placeholder="12345...." type="password" onChange={(e)=>{
                        setPostInput(c => ({
                            ...c,
                            password:e.target.value
                        }));
                    }}/>
                </div>
                <div className="mt-4">
                    <button  onClick={sendRequest} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        {type==="signin" ? "Sign in" : "Sign up"}
                    </button>
                    
                </div>
            </div>
        </div>
    </div>
}

function LabelIput({label,placeholder,onChange,type}:inputBox)
{
    return <div>
        <div>
            <label className="block mb-2 text-sm text-bold font-semibold text-gray-900 dark:text-white">{label}</label>
            <input type={type || "text"} id="first_name"  onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}

interface inputBox{
    label:string,
    placeholder:string
    onChange:(e:ChangeEvent<HTMLInputElement>) => void
    type?:string
}