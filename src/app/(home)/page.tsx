'use client';

import { DocumentsTable } from "./documents-table";

import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParam } from "@/hooks/use-search-param";

export default function Home() {

  const [search]=useSearchParam();
  const {results, status, loadMore}=usePaginatedQuery(api.documents.get, {search}, {initialNumItems: 5});

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
        <TemplateGallery />
        <DocumentsTable documents={results} status={status} loadMore={loadMore} />
      </div>
    </div>
  );
}