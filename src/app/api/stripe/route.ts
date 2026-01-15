import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    const data = await request.json();

    console.log("Stripe Webhook received customer email:", data.data.object.customer_email);
    // fullfill the order
    try{
        await prisma.user.update({
            where: {
                email: data.data.object.customer_email,
            },
            data: {
                hasAccess: true,
            }
        })
    } catch (error) {
        console.error("Error updating user access:", error);
    }

    // return OK
    return Response.json( null, {status: 200 } );
}