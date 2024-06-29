import axios from "axios";
import {useEffect,useState} from "react";
import { BACKEND_URL } from "../config";

export interface Blog{
    content:string,
    title:string,
    id:string,
    author:{
        name:string
    }
    publishedDate?:string
}


export const useBlog=({id}:{id:string})=>{
    const [loading,setLoading] = useState(true)
    const [blog,setBlog] = useState<Blog>()
    console.log("afsdfjhasldfhslahfjsahfljhasldfh");
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then((response)=>{
            console.log(response.data)
            setBlog(response.data)
            setLoading(false)
        })
    },[])

    return{
        loading,blog
    }


}
export const useBlogs=()=>{
    const [loading,setLoading] = useState(true)
    const [blogs,setBlogs] = useState<Blog[]>([])

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }).then((response)=>{
            console.log(response.data)
            setBlogs(response.data)
            setLoading(false)
        })
    },[])

    return{
        loading,blogs
    }


}