import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";

export const getCachedById = internalQuery({
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comics")
      .withIndex("by_num", (q) => q.eq("num", args.id))
      .collect();
  },
  args: {
    id: v.number(),
  },
});

export const cacheComic = internalMutation({
  handler: async (ctx, args) => {
    await ctx.db.insert("comics", {
      month: args.month,
      num: args.num,
      link: args.link,
      year: args.year,
      news: args.news,
      safe_title: args.safe_title,
      transcript: args.transcript,
      alt: args.alt,
      img: args.img,
      title: args.title,
      day: args.day,
    });
  },
  args: {
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
  },
});

export const getById = action({
  handler: async (ctx, args) => {
    // const cachedComic = await ctx.runQuery(internal.xkcd.getCachedById, {
    //   id: args.id,
    // });

    // if (cachedComic.length > 0) {
    //   return {
    //     month: cachedComic.month,
    //     num: cachedComic.number,
    //     link: cachedComic.string,
    //     year: cachedComic.string,
    //     news: cachedComic.string,
    //     safe_title: cachedComic.string,
    //     transcript: cachedComic.string,
    //     alt: cachedComic.string,
    //     img: cachedComic.string,
    //     title: cachedComic.string,
    //     day: cachedComic.string,
    //   };
    // }

    const data = await fetch(`https://xkcd.com/${args.id}/info.0.json`);
    const json = (await data.json()) as {
      month: string;
      num: number;
      link: string;
      year: string;
      news: string;
      safe_title: string;
      transcript: string;
      alt: string;
      img: string;
      title: string;
      day: string;
    };

    await ctx.runMutation(internal.xkcd.cacheComic, json);

    return json;
  },
  args: {
    id: v.number(),
  },
});
