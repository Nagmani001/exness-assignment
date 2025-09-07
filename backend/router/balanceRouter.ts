import { Router } from "express";
import { redisStream } from "..";
import { redisClient } from "..";
import { TRADE_STREAM } from "../config/utils";

export const balanceRouter = Router();

balanceRouter.get("/usd", async (req, res) => {
  const email = req.cookies.email;

  const id = crypto.randomUUID();
  redisClient.xAdd(TRADE_STREAM, "*", {
    message: JSON.stringify({
      id,
      type: "get-usd-balance",
      email,
    })
  });

  const messsage: any = await redisStream.waitForMessage(id);
  const actualBalance = JSON.parse(messsage.message).usdBalance

  res.json({
    balance: actualBalance,
  });
});


balanceRouter.get("/balance", async (req, res) => {

  const email = req.cookies.email;
  const id = crypto.randomUUID();

  redisClient.xAdd(TRADE_STREAM, "*", {
    message: JSON.stringify({
      id,
      type: "get-balance",
      email,
    })
  });

  const messsage: any = await redisStream.waitForMessage(id);
  const actualBalance = JSON.parse(messsage.message).balances;
  res.json({
    balances: actualBalance
  });
});
