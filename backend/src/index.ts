import { Hono } from 'hono'
import {cors } from "hono/cors"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { sign, verify } from 'hono/jwt';

import {userRouter} from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
  Variables: {
    userID: string
  }
}>();


app.use(cors())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

//middleware routes to handle requests
app.use('/api/v1/blog/*',async(c,next)=>{

  const header=c.req.header("Authorization") || "";
  //console.log(header)
  const token = header.split(" ")[1];
  
  const response =await verify(token,c.env.JWT_SECRET);
  if(!response)
    {
      c.status(401);
      return c.json({error:"unauthorized"});
    }
    //@ts-ignore
    c.set("userID",response.id)
    await next();
})
app.route("/api/v1",userRouter);
app.route("/api/v1",blogRouter);





// app.post("/api/v1/signup",async(c) =>{
//   console.log(c.env.SECRET_KEY);
//   try{
//       const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL
//       }).$extends(withAccelerate());

//       const body = await c.req.json();

//       const user = await prisma.user.create({
//         data: {
//           email: body.email,
//           password: body.password,
//         },
//       });

//       const token = await sign({ id: user.id },c.env.SECRET_KEY)

//       return c.json({
//         jwt: token
//       })
    
//   }
//   catch(e: any)
//   {
//     console.log("cach blocl")
//     return c.json({message:e.message});
//   }

// })


// app.post("/api/v1/signin",async(c) =>{
//   const prisma = new PrismaClient({
// 		datasourceUrl: c.env.DATABASE_URL
// 	}).$extends(withAccelerate());

//     const body = await c.req.json();
//     const user = await prisma.user.findUnique({
//       where: {
//         email: body.email,
//         password:body.password
//       }
//     });

//     if (!user) {
//       c.status(403);
//       return c.json({ error: "user not found" });
//     }

//     const jwt = await sign({ id: user.id }, "mysecret");
//     return c.json({ jwt });
// })


// app.get("/api/v1/blog",(c) =>{
//   console.log(c.get("userID"))
//   return c.text("hello from the blog")
// })

// app.post("/api/v1/blog/:id",(c) =>{
//   return c.text("hello from the blog id ")
// })

// app.post("/api/v1/blog/bulk",(c) =>{
//   return c.text("hello from the blog bulk ")
// })


export default app
