'use client';

import { Separator } from "@/components/ui/separator";
import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";

const AVATAR_SIZE = 36;

export const Avatars=()=>{
    return (
        <ClientSideSuspense fallback={null}>
            <AvatarStack/>
        </ClientSideSuspense>
    )
}

const AvatarStack=()=>{
    const currentUser=useSelf();
    const others=useOthers();

    if(others.length===0){
        return null;
    }

    return (
        <>
            <div className="flex items-center">
                {currentUser && (
                    <div className="relative ml-2">
                        <Avatar src={currentUser.info.avatar} name="You" />
                    </div>
                )}
                <div className="flex">
                    {others.map(({connectionId, info}) => (
                        <Avatar src={info.avatar} name={info.name} key={connectionId}></Avatar>
                    ))}
                </div>
            </div>
            <Separator orientation="vertical" className="h-6"/>
        </>
    )
}

interface AvatarProps {
    src: string;
    name: string;
}

const Avatar=({src, name}: AvatarProps)=>{
    return (
        <div 
        style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
        }}
        className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400">
            <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
                {name}
            </div>
            <Image src={src} alt={name} width={AVATAR_SIZE} height={AVATAR_SIZE} className="size-full rounded-full" />
        </div>
    )  
}