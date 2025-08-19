import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      if (args.currency && existingUser.currency !== args.currency) {
        await ctx.db.patch(existingUser._id, { currency: args.currency });
      }

      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      ...args,
      currency: args.currency || "USD",
      createdAt: Date.now(),
    });
  },
});

export const updateCurrency = mutation({
  args: {
    userId: v.string(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (user) {
      return await ctx.db.patch(user._id, {
        currency: args.currency,
      });
    }
  },
});

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});
