import { v } from "convex/values";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { cache } from "react";

async function cacheComic(
  data: {
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
  },
  ctx: ActionCtx,
) {
  const imageUrl = data.img;

  const response = await fetch(imageUrl);
  const image = await response.blob();

  const storageId: Id<"_storage"> = await ctx.storage.store(image);

  await ctx.runMutation(internal.xkcd.writeCachedComic, {
    month: data.month,
    num: data.num,
    link: data.link,
    year: data.year,
    news: data.news,
    safe_title: data.safe_title,
    transcript: data.transcript,
    alt: data.alt,
    img: data.img,
    title: data.title,
    day: data.day,
    storageId: storageId,
  });

  return {
    month: data.month,
    num: data.num,
    link: data.link,
    year: data.year,
    news: data.news,
    safe_title: data.safe_title,
    transcript: data.transcript,
    alt: data.alt,
    img: (await ctx.storage.getUrl(storageId)) || data.img,
    title: data.title,
    day: data.day,
  };
}

export const getCachedById = internalQuery({
  handler: async (ctx, args): Promise<Doc<"comics"> | null> => {
    let comic = await ctx.db
      .query("comics")
      .withIndex("by_num", (q) => q.eq("num", args.id))
      .first();

    if (!comic) {
      return null;
    }

    if (comic.storageId) {
      comic.img = (await ctx.storage.getUrl(comic.storageId)) || comic.img;
    }

    return comic;
  },
  args: {
    id: v.number(),
  },
});

export const writeCachedComic = internalMutation({
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
      storageId: args.storageId,
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
    storageId: v.optional(v.id("_storage")),
  },
});

export const getById = action({
  handler: async (
    ctx,
    args,
  ): Promise<{
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
  }> => {
    const cachedComic: Doc<"comics"> | null = await ctx.runQuery(
      internal.xkcd.getCachedById,
      {
        id: args.id,
      },
    );

    if (cachedComic) {
      return {
        month: cachedComic.month,
        num: cachedComic.num,
        link: cachedComic.link,
        year: cachedComic.year,
        news: cachedComic.news,
        safe_title: cachedComic.safe_title,
        transcript: cachedComic.transcript,
        alt: cachedComic.alt,
        img: cachedComic.img,
        title: cachedComic.title,
        day: cachedComic.day,
      };
    }

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

    return await cacheComic(json, ctx);
  },
  args: {
    id: v.number(),
  },
});

export const getLatest = action({
  handler: async (
    ctx,
    args,
  ): Promise<{
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
  }> => {
    const data = await fetch(`https://xkcd.com/info.0.json`);
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

    const cachedComic: Doc<"comics"> | null = await ctx.runQuery(
      internal.xkcd.getCachedById,
      {
        id: json.num,
      },
    );

    if (cachedComic) {
      return cachedComic;
    } else {
      return await cacheComic(json, ctx);
    }
  },
});
