import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  comics: defineTable({
    month: v.string(),
    num: v.number(),
    link: v.string(),
    year: v.string(),
    news: v.string(),
    safe_title: v.string(),
    transcript: v.string(),
    alt: v.string(),
    img: v.string(),
    title: v.string(),
    day: v.string(),
    storageId: v.optional(v.id("_storage")),
  }).index("by_num", ["num"]),
  saves: defineTable({
    num: v.number(),
    user: v.id("users"),
  })
    .index("by_user", ["user"])
    .index("by_user_num", ["user", "num"]),
  ...authTables,
});

export default schema;
