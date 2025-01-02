
import { NextRequest } from "next/server";
import {z} from 'zod'
import { prisma } from "@/prisma/client";


const createIssueSchema= z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['OPEN','IN_PROGRESS', 'CLOSED'])
})

export async function POST(request: NextRequest) {

    const body = await request.json()
    const validation= createIssueSchema.safeParse(body)
   if(!validation.success){
       return new Response(JSON.stringify(validation.error), {status:400})
   }
  const newIssue = await prisma.issue.create({
    data: {title: body.title, description: body.description, status: body.status}
  })
    return new Response(JSON.stringify(newIssue), {status:201})
}