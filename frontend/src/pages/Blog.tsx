import { FullBlog } from "../components/Fullblog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";

const Blog = () => {
  const {id}=useParams();
  console.log(id);
  const{loading,blog}=useBlog({id:id ||""});
  
  if(loading || !blog) {
    return <div className="h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <Spinner />
      </div>

    </div>
  };


  return (
    <div>
      <FullBlog blog={blog}/>
    </div>
  )
}

export default Blog