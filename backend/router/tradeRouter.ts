import { Router } from "express";
import { TRADE_STREAM } from "../config/utils";
import { createTrade } from "../types/zodtypes";
import { redisClient, redisStream } from "..";

export const tradeRouter = Router();


tradeRouter.post("/create", async (req, res) => {
  const parsedData = createTrade.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      msg: "invalid data"
    });
    return;
  }

  const id = crypto.randomUUID();
  redisClient.xAdd(TRADE_STREAM, "*", {
    message: JSON.stringify({
      id,
      type: "create-trade",
      data: parsedData.data
    })
  });

  const message = await redisStream.waitForMessage(id);

  res.json({
    orderId: JSON.parse(message.message).orderId,
  });
});


tradeRouter.post("/close", async (req, res) => {
  const orderId = req.body.orderId;
  const id = crypto.randomUUID();
  redisClient.xAdd(TRADE_STREAM, "*", {
    message: JSON.stringify({
      id,
      type: "close-trade",
      orderId,
    })
  });

  const response = await redisStream.waitForMessage(id);

  res.json({
    msg: JSON.parse(response.message),
  });

});
