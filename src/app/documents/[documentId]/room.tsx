"use client";

import { ReactNode, useEffect, useMemo } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import React from "react";
import { toast } from "sonner";
import { getUsers, getDocuments } from "./actions";
import { Id } from "../../../../convex/_generated/dataModel";

type User={
    id: string;
    name: string;
    avatar: string;
    color: string;
}

export function Room({ children }: { children: ReactNode }) {
    const params=useParams();
    const [users, setUsers] = React.useState<User[]>([]);

    const fetchUsers=useMemo(
      ()=>async () => {
        try{
          const list=await getUsers();
          setUsers(list);
        }
        catch{
          toast.error("Failed to fetch users")
        }
      }, []
    )

    useEffect(()=>{
      fetchUsers();
    }, [fetchUsers]);
  return (
    <LiveblocksProvider throttle={16} authEndpoint={async ()=>{
      const endpoint="/api/liveblocks-auth";
      const room=params.documentId as string;
      const response=await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({room}),
      });
      return await response.json();
    }}
      resolveUsers={({userIds})=>{
        return userIds.map((id) => users.find((user) => user.id === id));
      }}
      resolveMentionSuggestions={({text})=>{
        let filteredUsers=users;
        if(text){
          filteredUsers=users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
        }
        return filteredUsers.map((user)=>user.id);
      }
      }
      resolveRoomsInfo={async ({roomIds})=>{
        const documents=await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.title,
        }));
      }}
    >
      <RoomProvider id={params.documentId as string} initialStorage={{leftMargin: 56, rightMargin: 56}}>
        <ClientSideSuspense fallback={<FullScreenLoader label="Loading Room"/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}