import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";

export async function isAuthenticated(c: { req: { header: (arg0: string) => string; }; status: (arg0: number) => void; json: (arg0: { error: string; }) => any; },next: () => any){
    const header=c.req.header("Authorization") || "";
  const token = header.split(" ")[1];
  
  const response =await verify(token,"mysecret");
  if(!response)
    {
      c.status(401);
      return c.json({error:"unauthorized"});
    }
    
    await next();
}


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
    SECRET_KEY: string
	}
  Variables: {
    userID: string
  }
}>();

// export const prismaMiddleware=async(c:any)=>{
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL
//       }).$extends(withAccelerate());

//       return prisma;
    
// }



export type Bindings={
    DATABASE_URL:string
    JWT_SECRET:string
}

export type Variables={
    userID: string
}