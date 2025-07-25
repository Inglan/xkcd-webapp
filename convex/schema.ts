import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  favourites: defineTable({
    num: v.number(),
    user: v.id("users"),
  }),
  ...authTables,
});

export default schema;
