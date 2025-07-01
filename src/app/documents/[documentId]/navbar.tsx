'use client'

import Image from "next/image";
import Link from "next/link";
import { DocumentInput } from "./document-input";
import { Menubar, MenubarContent, MenubarItem, MenubarTrigger, MenubarSeparator, MenubarMenu, MenubarSubContent, MenubarSubTrigger, MenubarSub, MenubarShortcut } from "@/components/ui/menubar";
import { FileIcon, BoldIcon, ItalicIcon, FileJsonIcon, FilePenIcon, FilePlusIcon, FileTextIcon, GlobeIcon, PrinterIcon, TrashIcon, Undo2Icon, TextIcon, UnderlineIcon, StrikethroughIcon, RemoveFormattingIcon, Redo2Icon } from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Avatars } from "./avatars";
import { Inbox } from "./inbox";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";
interface NavbarProps {
    data: Doc<"documents">;
}

export const Navbar = ({data}: NavbarProps) => {
    const router = useRouter();
    const {editor} = useEditorStore();
    const mutation=useMutation(api.documents.create);
    const onNewDocument = () => {
        mutation({title: 'Untitled Document', initialContent: ''}).then((documentId) => {
            toast.success("Document created");
            router.push(`/documents/${documentId}`);
        }).catch(() => {
            toast.error("Failed to create document");
        })
    }

    const insertTable=({rows, cols}: {rows: number, cols: number}) => {
        editor?.chain().focus().insertTable({rows, cols, withHeaderRow: false}).run();
    };

    const onDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        //URL.revokeObjectURL(url);
    }

    const onSaveJson = () => {
        const json = editor?.getJSON();
        const blob = new Blob([JSON.stringify(json)], {type: "application/json"});
        onDownload(blob, `${data.title}.json`);
    }

    const onSaveHtml = () => {
        const content = editor?.getHTML();
        const blob = new Blob([content ?? ''], {type: "text/html"});
        onDownload(blob, `${data.title}.html`);
    }

    const onSaveText = () => {
        const content = editor?.getHTML();
        const blob = new Blob([content ?? ''], {type: "text/plain"});
        onDownload(blob, `${data.title}.txt`);
    }

    return (
        <nav className="flex items-center justify-between space-x-4">
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Image src="/simdocsLogo.png" alt="logo" width={36} height={36} />
                </Link> 
                <div className="flex flex-col">
                    {<DocumentInput title={data.title} id={data._id} />}
                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger>File</MenubarTrigger>
                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger><FileIcon className="mr-2 size-4" />
                                        Save</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveJson}><FileJsonIcon className="mr-2 size-4" />JSON</MenubarItem>
                                            <MenubarItem onClick={onSaveHtml}><GlobeIcon className="mr-2 size-4" />HTML</MenubarItem>
                                            <MenubarItem onClick={()=>{window.print()}}><BsFilePdf className="mr-2 size-4" />PDF</MenubarItem>
                                            <MenubarItem onClick={onSaveText}><FileTextIcon className="mr-2 size-4" />Text</MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={onNewDocument}><FilePlusIcon className="mr-2 size-4" ></FilePlusIcon>New Document</MenubarItem>
                                    <MenubarSeparator />
                                    <RenameDialog documentId={data._id} initialValue={data.title}><MenubarItem onClick={(e) => {e.stopPropagation()}} onSelect={(e) => {e.preventDefault()}}><FilePenIcon className="mr-2 size-4"></FilePenIcon>Rename</MenubarItem></RenameDialog>
                                    <MenubarSeparator />
                                    <RemoveDialog documentId={data._id}><MenubarItem onClick={(e) => {e.stopPropagation()}} onSelect={(e) => {e.preventDefault()}}><TrashIcon className="mr-2 size-4" ></TrashIcon>Remove</MenubarItem></RemoveDialog>
                                    <MenubarSeparator />
                                    <MenubarItem onClick={() => window.print()}><PrinterIcon className="mr-2 size-4" ></PrinterIcon>Print<MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger>Edit</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={()=>editor?.chain().focus().undo().run()}><Undo2Icon className="mr-2 size-4" ></Undo2Icon>Undo</MenubarItem>
                                    <MenubarItem onClick={()=>editor?.chain().focus().redo().run()}><Redo2Icon className="mr-2 size-4" ></Redo2Icon>Redo</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Cut</MenubarItem>
                                    <MenubarItem>Copy</MenubarItem>
                                    <MenubarItem>Paste</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger>Insert</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger><FileIcon className="mr-2 size-4" />
                                        Table</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => insertTable({rows: 1, cols: 1})}>1 x 1</MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 2, cols: 2})}>2 x 2</MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 3, cols: 3})}>3 x 3</MenubarItem>
                                            <MenubarItem onClick={() => insertTable({rows: 4, cols: 4})}>4 x 4</MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger>Format</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger><TextIcon className="mr-2 size-4" />
                                        Text</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}><BoldIcon className="mr-2 size-4" />Bold<MenubarShortcut>⌘B</MenubarShortcut></MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}><ItalicIcon className="mr-2 size-4" />Italic<MenubarShortcut>⌘I</MenubarShortcut></MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="mr-2 size-4" />Underline<MenubarShortcut>⌘U</MenubarShortcut></MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}><StrikethroughIcon className="mr-2 size-4" />Strikethrough<MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}><RemoveFormattingIcon className="mr-2 size-4" />Clear Formatting</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 pl-6">
            <Avatars/>
            <Inbox/>
            <OrganizationSwitcher 
                afterCreateOrganizationUrl={"/"}
                afterSelectOrganizationUrl={"/"}
                afterLeaveOrganizationUrl={"/"}
                afterSelectPersonalUrl={"/"}
            />
            <UserButton />
            </div>     
        </nav>
    );
}