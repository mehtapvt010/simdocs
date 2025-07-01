'use client'


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
interface RenameDialogProps {
    documentId: Id<"documents">;
    initialValue: string;
    children: React.ReactNode;
}

export function RenameDialog({ documentId, initialValue, children }: RenameDialogProps) {
    const update=useMutation(api.documents.updateById);
    const [isUpdating, setIsUpdating]=React.useState(false);
    const [title, setTitle]=React.useState(initialValue);
    const [open, setOpen]=React.useState(false);

    const onSubmit=(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        update({ documentId: documentId, title: title.trim() || "Untitled" }).then(() => {
            setOpen(false);
        })
        .finally(() => {
            setIsUpdating(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename Document</DialogTitle>
                        <DialogDescription>
                            Enter a new name for the document
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-4">
                        <Input
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Document Name"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant={"ghost"} disabled={isUpdating} onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false)}}
                            >
                                Cancel
                                </Button>
                        <Button type="submit" disabled={isUpdating} onClick={(e) => e.stopPropagation()}>Save</Button>
                    </DialogFooter>
                </form>
                
                
            </DialogContent>

        </Dialog>
    )
}