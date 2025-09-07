import { createClient } from "redis";
const ws = new WebSocket("wss://ws.backpack.exchange/");

let btcPrice = 0;
let solPrice = 0;
let ethPrice = 0;
ws.onopen = () => {
  ws.send(JSON.stringify({
    method: "SUBSCRIBE",
    params: ["trade.SOL_USDC"],
    id: 3
  }));

  ws.send(JSON.stringify({
    method: "SUBSCRIBE",
    params: ["trade.BTC_USDC"],
    id: 3
  }));

  ws.send(JSON.stringify({
    method: "SUBSCRIBE",
    params: ["trade.ETH_USDC"],
    id: 3
  }));



  ws.onmessage = (data: any) => {
    const parsedData = JSON.parse(data.data);
    if (parsedData.data.s == "SOL_USDC") {
      console.log("solPrice", parsedData.data.p);
      solPrice = parseFloat(parsedData.data.p);
    } else if (parsedData.data.s == "BTC_USDC") {
      console.log("btcPrice", parsedData.data.p);
      btcPrice = parseFloat(parsedData.data.p);
    } else if (parsedData.data.s == "ETH_USDC") {
      console.log("ethPrice", parsedData.data.p);
      ethPrice = parseFloat(parsedData.data.p);
    }
  }

}

async function main() {
  const client = await createClient().connect();
  setInterval(() => {
    client.xAdd("trade-stream", "*", {
      message: JSON.stringify({
        type: "price-update",
        "price_updates": [
          {
            "asset": "BTC",
            "price": btcPrice * 100,
            "decimal": 2,
          }, {
            "asset": "SOL",
            "price": solPrice * 100,
            "decimal": 2,
          }, {
            "asset": "ETH",
            "price": ethPrice * 100,
            "decimal": 2,
          }
        ]
      })
    });
  }, 100)
}
main();
