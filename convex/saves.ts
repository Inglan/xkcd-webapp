import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const savesNums = await ctx.db
      .query("saves")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .collect();

    let saves: Doc<"comics">[] = [];

    for (const saveNum of savesNums) {
      const comic = await ctx.db
        .query("comics")
        .withIndex("by_num", (q) => q.eq("num", saveNum.num))
        .collect();
      saves.push(comic[0]);
    }

    return saves;
  },
});
