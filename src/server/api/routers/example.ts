import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async({ input, ctx }) => {
      if (!ctx.session?.user) throw new TRPCError({
        message : "User not logged in.",
        code : "UNAUTHORIZED" 
      })
      try {
        const apples = await ctx.prisma.userApples.findUniqueOrThrow({
          where : {
            userId: ctx.session?.user.id
          }
        })
        return {
          greeting: `You have ${ apples.apples } apples`,
        };
      }
      catch(e){
        throw new TRPCError({
          message : "User not logged in.",
          code : "UNAUTHORIZED" 
        })
      }
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
