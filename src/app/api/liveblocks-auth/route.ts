import {Liveblocks} from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex=new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks=new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
})
export async function POST(req: Request) {
    const authorization=await auth();
    const user=await currentUser();

    if(!authorization || !user){
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 403});
    }

    const {room}=await req.json();
    const document=await convex.query(api.documents.getById, {documentId: room as Id<"documents">});

    if(!document) {
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 403});
    }

    console.log('AUTHORIZATION DEBUG', authorization);
    const orgId = (authorization.sessionClaims?.o as { id?: string })?.id;
    const isOwner = document.ownerId === user.id;
    const isMember = document.organizationId ? document.organizationId === orgId : false;

    if(!isOwner && !isMember){
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 403});
    }

    const name=user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    const nameToNumber=name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue=Math.abs(nameToNumber) % 360;
    const color=`hsl(${hue}, 80%, 60%)`;

    const userInfo = {
        name: name,
        color: color,
        avatar: user.imageUrl,
      };

    const session=liveblocks.prepareSession(user.id, {userInfo});

    session.allow(room, session.FULL_ACCESS);
    const {body, status}=await session.authorize();
    return new Response(body, {status});
}