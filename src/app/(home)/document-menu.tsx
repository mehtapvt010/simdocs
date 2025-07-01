import { Button } from "@/components/ui/button"
import { ExternalLinkIcon, FilePenIcon, MoreVertical, TrashIcon } from "lucide-react"
import { Id } from "../../../convex/_generated/dataModel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuShortcut } from "@/components/ui/dropdown-menu"

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";

interface DocumentMenuProps{
    documentId: Id<"documents">;   
    title: string;
    onNewTab: (documentId: Id<"documents">) => void;
}

export const DocumentMenu=( {documentId, title, onNewTab}: DocumentMenuProps)=>{
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <RemoveDialog documentId={documentId}>
                    <DropdownMenuItem onSelect={(e) => {e.preventDefault()}} onClick={(e) => {e.stopPropagation()}}>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </RemoveDialog>
                <RenameDialog documentId={documentId} initialValue={title}>
                    <DropdownMenuItem onSelect={(e) => {e.preventDefault()}} onClick={(e) => {e.stopPropagation()}}>
                        <FilePenIcon className="mr-2 h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                </RenameDialog>
                <DropdownMenuItem onClick={() => onNewTab(documentId)}>
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    Open in a New Tab
                    <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}