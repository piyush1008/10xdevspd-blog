import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { Bindings,Variables } from "../middleware";
import { signinInput,signupInput } from "@piyush10xdev/medium-common";

// type Bindings={
//     DATABASE_URL:string
//     JWT_SECRET:string
// }

// type Variables={
//     userID: string
// }

export const userRouter=new Hono<{
    Bindings:Bindings
    Variables:Variables
}>();


userRouter.post("/signup",async(c)=>{
  try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
      }).$extends(withAccelerate());

      const body = await c.req.json();
      console.log(body)
      const {success}= signupInput.safeParse(body);
      if(!success)
        {
         c.status(400);
         return c.json({
          message: "user input is invalid"
         })
        }
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        },
      });

      const token = await sign({ id: user.id },c.env.JWT_SECRET)

      return c.json({
        jwt: token
      })
    
  }
  catch(e: any)
  {
    console.log("cach blocl")
    return c.json({message:e.message});
  }

})


userRouter.post("/signin",async(c)=>{
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
    
        const body = await c.req.json();

        const {success}= signinInput.safeParse(body);
        if(!success){
          c.status(403);
          return c.json({
            message:"user input is invalid"
          })
        }
        const user = await prisma.user.findUnique({
          where: {
            email: body.email,
            password:body.password
          }
        });
    
        if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
        }
    
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    }
    catch(e:any)
    {
        c.status(400);
        c.text(e.message);
    }
    
})

