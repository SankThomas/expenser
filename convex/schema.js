import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    currency: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  categories: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  expenses: defineTable({
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
    category: v.string(),
    date: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),
});
