import { z } from "zod";

export const createTrade = z.object({
  email: z.string(),
  asset: z.string(),
  type: z.enum(["long", "short"]),
  margin: z.number(),
  leverage: z.number(),
  slippage: z.number()
});

export const closeTrade = z.object({
  orderId: z.string()
});
