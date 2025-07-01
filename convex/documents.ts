import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getByIds=query({
  args: {
    documentIds: v.array(v.id("documents")),
  },
  handler: async (ctx, {documentIds}) => {
    const documents=[];

    for(const documentId of documentIds){
      const document=await ctx.db.get(documentId);
      if(document){
        documents.push({id: document._id, title: document.title});
      } else{
        documents.push({id: documentId, name: "[Deleted]"});
      }
    }

    return documents;
  },
})

export const get = query({
  args: {paginationOpts: paginationOptsValidator, search: v.optional(v.string())},
  handler: async (ctx, args) => {
    const user=await ctx.auth.getUserIdentity();

    if(!user){
      throw new Error("Unauthenticated");
    }

    const organizationId=(user.organization_id ?? undefined) as string | undefined;

    if(args.search && organizationId){
      return await ctx.db.query("documents").withSearchIndex("search_title", (q) => q.search("title", args.search!).eq("organizationId", organizationId)).paginate(args.paginationOpts);
    }

    if(args.search){
      return await ctx.db.query("documents").withSearchIndex("search_title", (q) => q.search("title", args.search!).eq("ownerId", user.subject)).paginate(args.paginationOpts);
    }

    return await ctx.db.query("documents").withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject)).paginate(args.paginationOpts);
  },
});

export const create = mutation({

  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  
    handler: async (ctx, args) => {
        const user=await ctx.auth.getUserIdentity();
        if(!user){
            throw new Error("Unauthenticated");
        };

        const organizationId=(user.organization_id ?? undefined) as string | undefined;

        const document = await ctx.db.insert("documents", {
            title: args.title ?? "Untitled Document",
            organizationId,
            initialContent: args.initialContent,
            ownerId: user.subject,
        });
        return document;
    },
  },
);

export const removeById=mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user=await ctx.auth.getUserIdentity();
    if(!user){
        throw new Error("Unauthenticated");
    };
    const organizationId=(user.organization_id ?? undefined) as string | undefined;

    const document=await ctx.db.get(args.documentId);
    if(!document){
        throw new Error("Document not found");
    }
    if(document.ownerId!==user.subject && !!(document.organizationId && document.organizationId!==organizationId)){
        throw new Error("Unauthorized");
    }
    return await ctx.db.delete(args.documentId);
  },
});

export const updateById=mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user=await ctx.auth.getUserIdentity();
    if(!user){
        throw new Error("Unauthenticated");
    };
    const document=await ctx.db.get(args.documentId);
    const organizationId=(user.organization_id ?? undefined) as string | undefined;

    if(!document){
        throw new Error("Document not found");
    }
    if(document.ownerId!==user.subject && !!(document.organizationId && document.organizationId!==organizationId)){
        throw new Error("Unauthorized");
    }
    return await ctx.db.patch(args.documentId, {
        title: args.title,
        initialContent: args.initialContent,
    });
  },
});

export const getById=query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document=await ctx.db.get(args.documentId);
    if(!document){
        throw new ConvexError("Document not found");
    }
    return document;
  },
});

