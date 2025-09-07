import express from "express";
let cookieParser = require('cookie-parser')
import cors from "cors";
import { userRouter } from "./router/userRouter";
import { createClient } from "redis";
import { tradeRouter } from "./router/tradeRouter";
import { balanceRouter } from "./router/balanceRouter";
import { RedisManager } from "./config/redisManager";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

export const redisStream = new RedisManager();

app.use("/api/v1/", userRouter);
app.use("/api/v1/trade", tradeRouter);
app.use("/api/v1/balance", balanceRouter);


app.get("/api/v1/supportedAssets", (req, res) => {
  res.json({
    "assets": [{
      symbol: "BTC",
      name: "Bitcoin",
      imageUrl: "example.bitcoin.com/png"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      imageUrl: "example.ethereum.com/png"
    },
    {
      symbol: "SOL",
      name: "Solana",
      imageUrl: "example.solana.com/png"
    }]
  })
});

app.post("/test", async (req, res) => {
  const startTime = Date.now();
  try {
    const id = Math.random().toString();

    redisClient.xAdd("nagmani", "*", {
      data: JSON.stringify({
        id,
        data: "hi ser from backend "
      })
    });

    console.log("pused to redis stream");

    const message = await redisStream.waitForMessage(id);

    console.log("received message back");
    console.log("message", message);
    const endTime = Date.now();
    res.json({
      msg: message,
      time: endTime - startTime
    })

  } catch (err) {
    console.log("somehing wrong occured");
  }
});

export const redisClient = createClient();
async function main() {

  await redisClient.connect();
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}
main();
