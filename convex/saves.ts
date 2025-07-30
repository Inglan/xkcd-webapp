import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
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

export const toggle = mutation({
  args: {
    num: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    const save = await ctx.db
      .query("saves")
      .withIndex("by_user_num", (q) => q.eq("user", userId).eq("num", args.num))
      .first();

    if (save) {
      await ctx.db.delete(save._id);
    } else {
      await ctx.db.insert("saves", {
        user: userId,
        num: args.num,
      });
    }
  },
});

export const isSaved = query({
  args: {
    num: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const save = await ctx.db
      .query("saves")
      .withIndex("by_user_num", (q) => q.eq("user", userId).eq("num", args.num))
      .first();

    return !!save;
  },
});

export const importData = mutation({
  args: {
    data: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    const saves = args.data.split(",");

    for (const save of saves) {
      const existingSave = await ctx.db
        .query("saves")
        .withIndex("by_user_num", (q) =>
          q.eq("user", userId).eq("num", parseInt(save)),
        )
        .first();
      if (!existingSave) {
        await ctx.db.insert("saves", {
          user: userId,
          num: parseInt(save),
        });
      }
    }
  },
});
