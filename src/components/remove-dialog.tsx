'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface RemoveDialogProps {
    documentId: Id<"documents">;
    children: React.ReactNode;
}

export function RemoveDialog({ documentId, children }: RemoveDialogProps) {
    const router=useRouter();
    const remove=useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving]=React.useState(false);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to remove this document?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => { e.stopPropagation()} }>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isRemoving} onClick={ (e) => { e.stopPropagation(); setIsRemoving(true); remove({ documentId }).catch(()=>toast.error("Failed to remove document")).then(() => {router.push("/");
                        toast.success("Document removed");
                    }).finally(() => setIsRemoving(false)) }}>Remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}