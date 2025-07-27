import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const info = query({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return {
        name: "",
        email: "",
      };
    }

    const userObj = await ctx.db.get(userId);

    if (userObj?.isAnonymous) {
      return {
        name: "Anonymous",
        email: "",
        anonymous: true,
      };
    } else {
      return {
        name: userObj?.name,
        email: userObj?.email,
        anonymous: false,
      };
    }
  },
});

export const deleteAccount = mutation({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(userId);

    const authAccountsEntries = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();

    for (const entry of authAccountsEntries) {
      await ctx.db.delete(entry._id);
    }

    const authSessionsEntries = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    for (const entry of authSessionsEntries) {
      const authRefreshTokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", entry._id))
        .collect();
      for (const token of authRefreshTokens) {
        await ctx.db.delete(token._id);
      }
      await ctx.db.delete(entry._id);
    }

    const savesEntries = await ctx.db
      .query("saves")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();

    for (const entry of savesEntries) {
      await ctx.db.delete(entry._id);
    }
  },
});
