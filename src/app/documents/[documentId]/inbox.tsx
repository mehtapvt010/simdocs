'use client';

import { ClientSideSuspense } from "@liveblocks/react";
import { BellIcon } from "lucide-react";
import { useInboxNotifications} from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
export const Inbox=()=>{
    return (
        <>
            <ClientSideSuspense fallback={<Button variant="ghost" className="relative" size={"icon"}>
            <BellIcon className="h-5 w-5" />
            </Button>}>
                <InboxMenu/>
            </ClientSideSuspense>
            <Separator orientation="vertical" className="h-6"/>
        </>
    )
}

const InboxMenu=()=>{
    const { inboxNotifications } = useInboxNotifications();
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative" size={"icon"}>
                        <BellIcon className="h-5 w-5" />
                        {inboxNotifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 transform rounded-full bg-sky-500 text-xs text-white items-center justify-center"></span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto" align="end">
                    {inboxNotifications.length>0 ? (
                        <InboxNotificationList>
                            {inboxNotifications.map((notification) => (
                                <InboxNotification key={notification.id} inboxNotification={notification} />
                            ))}
                            
                        </InboxNotificationList>
                    ):(

                        <div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
                            No Notifications
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" className="h-6"/>
        </>
    )
} 