import { v } from "convex/values";
import { mutation, query } from "./_generated/server.js";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("categories", {
      ...args,
      createdAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getDefaultCategories = query({
  handler: async () => {
    return [
      { name: "Food", color: "#ef4444" },
      { name: "Shopping", color: "#8b5cf6" },
      { name: "Rent", color: "#3b82f6" },
      { name: "Entertainment", color: "#ec4899" },
      { name: "Electricity", color: "#eab308" },
      { name: "Healthcare", color: "#10b981" },
      { name: "Water", color: "#6366f1" },
      { name: "Education", color: "#f97316" },
      { name: "Business", color: "#14b8a6" },
      { name: "Other", color: "#6b7280" },
    ];
  },
});
