import { BlogSkeleton } from "../components/BlogSkeleton";
import { BlogCard } from "../components/Blogcard"
import { useBlogs } from "../hooks"


const Blogs = () => {
  const {loading,blogs}=useBlogs();

  if(loading)
  {
    return <div className="flex justify-center">
        <div className="flex-col ">
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
    </div>
  }
  return (
    <div className="flex justify-center">
        <div>


            {blogs.map(blog=><BlogCard 
            id={blog.id}
            authorName={blog.author.name || "Anonymous"}
            title={blog.title}
            content={blog.content}
            publishDate={blog.publishedDate || ""}
            
            /> )}

            {/* <BlogCard 
            authorName="Piyush"
            title="How an ugly single page website makes $5000 a month with affiliate marketing"
            content="No need to create a fancy and modern website with hundredds of pages to make money online.--Making money online is the dream for man"
            publishDate="2nd Feb 2024"
            
            /> */}
        </div>
    </div>
  )
}

export default Blogs