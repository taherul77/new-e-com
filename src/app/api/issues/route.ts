import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../prisma/client";

const createIssueSchema = z.object({
    title: z.string(),
    description: z.string(),
});

export async function POST(request: NextRequest) {
    let body;
    try {
        body = await request.json();
        console.log("Parsed body:", body);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return new Response(
            JSON.stringify({ error: "Invalid JSON payload" }),
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object") {
        console.error("Request body is invalid:", body);
        return new Response(
            JSON.stringify({ error: "Request body must be a non-empty object" }),
            { status: 400 }
        );
    }

    const validation = createIssueSchema.safeParse(body);
    if (!validation.success) {
        console.error("Validation errors:", validation.error.errors);
        return new Response(
            JSON.stringify({ error: validation.error.errors }),
            { status: 400 }
        );
    }

    try {
        console.log("Data to be inserted:", {
            title: body.title,
            description: body.description,
        });

        const newIssue = await prisma.issue.create({
            data: {
                title: body.title,
                description: body.description,
            },
        });

        return new Response(JSON.stringify(newIssue), { status: 201 });
    } catch (error) {
        console.error("Database error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
