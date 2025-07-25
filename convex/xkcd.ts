import { v } from "convex/values";
import { action } from "./_generated/server";

export const getById = action({
  handler: async (ctx, args) => {
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
    return json;
  },
  args: {
    id: v.number(),
  },
});
