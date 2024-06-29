import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

import { Bindings,Variables } from "../middleware";
import { createPostInput,updatePostInput } from "@piyush10xdev/medium-common";


export const blogRouter=new Hono<{
    Bindings:Bindings
    Variables:Variables
}>();


blogRouter.post("/blog",async (c) => {
    try{
        const userID = c.get("userID");   
    const prisma =new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    })
    const body=await c.req.json();

    const {success }=createPostInput.safeParse(body);
    if(!success){
        c.status(404);
        return c.json({
            message:"invalid post input"
        })
    }
    const post=await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId:userID
        }
    })
    console.log("post created is",post)

    return c.json({
        id:post.id
    })
}
catch(error)
{
    c.status(500);
    c.json({message:"error creating post"});
}
    
});
blogRouter.get('/blog/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.post.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            published:true,
            author:{
                select:{
                    name:true
                }
            }
        }
    });

	return c.json(posts);
})
blogRouter.get("/blog/:id",async(c)=>{
    const id=c.req.param("id");
    const prisma =new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const post=await prisma.post.findUnique({
        where:{
            id: id
        },
        select:{
            content:true,
            title:true,
            id: true,
            author:{
                select:{
                    name:true
                }
            }
 
        }
    })

    return c.json(post);
    
})


blogRouter.put('/blog', async (c) => {
    console.log("asfdasdfasdfdsfdsaf")
	const userId = c.get('userID');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();

    
    const {success }=updatePostInput.safeParse(body);
    if(!success){
        c.status(404);
        return c.json({
            message:"invalid post input"
        })
    }
    console.log(body);
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});
    console.log("asdfasdfasdf")
	return c.text('updated post');
});


