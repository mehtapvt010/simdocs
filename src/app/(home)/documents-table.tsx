import { PaginationStatus } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";
interface DocumentsTableProps {
    documents: Doc<"documents">[] | undefined;
    loadMore: (numItems: number) => void;
    status: PaginationStatus
}

export const DocumentsTable = ({ documents, loadMore, status }: DocumentsTableProps) => {
    return (
        <div className="mx-auto max-w-screen-xl px-16 py-6 flex flex-col gap-5">
            {documents===undefined ? (
                <div className="flex justify-center items-center h-24">
                    <LoaderIcon className="animate-spin size-6 text-muted-foreground" />
                </div>
            ): (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="">Name</TableHead>
                            <TableHead className="">&nbsp;</TableHead>
                            <TableHead className="hidden md:flex">Shared</TableHead>
                            <TableHead className="hidden md:flex">Created at</TableHead>
                        </TableRow>
                    </TableHeader>
                    {documents.length===0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No documents Found</TableCell>
                            </TableRow>
                        </TableBody>
                    ): (
                        <TableBody>
                            {documents.map((document) => (
                                <DocumentRow key={document._id} document={document} />
                            ))}
                        </TableBody>    
                    )}
                </Table>
            )}
            <div className="flex items-center justify-center">
                <Button variant="ghost" size={"sm"} onClick={() => loadMore(5)} disabled={status!=="CanLoadMore"}>
                    {status!=="CanLoadMore" ? "No more documents" : "Load more"}
                </Button>
            </div>
        </div>
    );
};