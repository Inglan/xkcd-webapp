import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const info = query({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userObj = await ctx.db.get(userId);

    if (userObj?.isAnonymous) {
      return {
        name: "Anonymous",
        email: "",
      };
    } else {
      return {
        name: userObj?.name,
        email: userObj?.email,
      };
    }
  },
});
