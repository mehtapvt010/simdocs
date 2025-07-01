import { BsCloudCheck, BsCloudSlash } from "react-icons/bs"
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";

interface DocumentInputProps {
    title: string;
    id: Id<"documents">;
}

export const DocumentInput = ({title, id}: DocumentInputProps) => {
    const status=useStatus();
    const [value, setValue]=useState(title);
    const [isPending, setIsPending]=useState(false);
    const [isEditing, setIsEditing]=useState(false);

    const inputRef=React.useRef<HTMLInputElement>(null);

    const mutate=useMutation(api.documents.updateById);

    const debounceUpdate=useDebounce( (newValue: string) => {
        if (newValue === title) {
            return;
        }

        setIsPending(true);
        mutate({documentId: id, title: newValue}).then(() => {
            toast.success("Document title updated");
        }).catch(() => {
            toast.error("Failed to update document title");
        }).finally(() => {
            setIsPending(false);
        })
    })
    const onChange=(e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue=e.target.value;
        setValue(newValue);
        debounceUpdate(newValue);
    }

    const handleSubmit=( e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsPending(true);
        mutate({documentId: id, title: value}).then(() => {
            toast.success("Document title updated");
            setIsEditing(false);
        }).catch(() => {
            toast.error("Failed to update document title");
        }).finally(() => {
            setIsPending(false);
        })
    }

    const showLoader=isPending || status==="connecting" || status==="reconnecting";
    const showError=status==="disconnected";
    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]"> 
                <span className="invisible whitespace-pre px-1.5 text-lg">
                        {value || " "}
                    </span>
                    <input ref={inputRef} onBlur={() => setIsEditing(false)} className="text-lg px-1.5 cursor-pointer truncate" value={value} onChange={onChange}></input>
                </form>
            ):(
                <span 
                onClick={()=>{
                    setIsEditing(true);
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 0);
                    inputRef.current?.focus();
                }}
                className="text-lg px-1.5 cursor-pointer truncate">{title}</span>
            )}
            {showError && <BsCloudSlash className="size-4"></BsCloudSlash>}
            {!showError && !showLoader && <BsCloudCheck></BsCloudCheck>}
            {showLoader && <LoaderIcon className="animate-spin size-4 text-muted-foreground"></LoaderIcon>}
        </div>
    )
}