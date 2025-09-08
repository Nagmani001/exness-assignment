import { createClient } from "redis";
import { TradeManager } from "./config/tradeManager";

const prices: { [key: string]: { price: number | null, decimal: number | null } } = {};
const TRADE_STREAM_RESPONSE = "trade-stream-response";

async function main() {
  const redis = await createClient().connect();

  const tradeManager = new TradeManager();
  redis.subscribe("latestPrice", (data: any) => {
    const parsedData = JSON.parse(data);

    parsedData.price_updates.forEach((x: any) => {
      prices[x.asset] = {
        price: Math.round(x.price),
        decimal: x.decimal
      }
    });
  });

  const redisClient = await createClient().connect();


  while (true) {
    const res17: any = await redisClient.xRead({
      key: 'trade-stream',
      id: "$",
    }, {
      BLOCK: 0,
    });

    if (!res17) {
      continue;
    }

    const response = JSON.parse(res17[0].messages[0].message.message)


    switch (response.type) {
      case "initialize-balance":
        console.log("initialize-balance");
        tradeManager.initializeBalance(response.email);
        await redisClient.xAdd(TRADE_STREAM_RESPONSE, "*", {
          message: JSON.stringify({
            id: response.id,
            message: "done",
          })
        });
        break;

      case "get-usd-balance":
        const usdBalance = tradeManager.getUsdBalance(response.email);
        await redisClient.xAdd(TRADE_STREAM_RESPONSE, "*", {
          message: JSON.stringify({
            id: response.id,
            usdBalance,
          })
        });

        break;

      case "get-balance":
        const balances = tradeManager.getBalance(response.email);
        await redisClient.xAdd(TRADE_STREAM_RESPONSE, "*", {
          message: JSON.stringify({
            id: response.id,
            balances,
          })
        });
        break;

      case "create-trade":
        const { email, asset, type, margin, leverage, slippage } = response.data;
        const orderId = tradeManager.createTrade(email, asset, type, margin, leverage, slippage);

        await redisClient.xAdd(TRADE_STREAM_RESPONSE, "*", {
          message: JSON.stringify({
            id: response.id,
            orderId
          })
        });

        break;

      case "close-trade":
        console.log(response);
        const trade = tradeManager.closeTrade(response.orderId);

        await redisClient.xAdd(TRADE_STREAM_RESPONSE, "*", {
          message: JSON.stringify({
            id: response.id,
            trade,
          })
        });
        break;

      case "price-update":
        tradeManager.setCurrentPrice(response.price_updates);
        break;
    }
  }
}
main();

