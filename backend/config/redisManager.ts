import { createClient, type RedisClientType } from "redis";

export class RedisManager {

  private client: RedisClientType;
  private callback: Record<string, () => void>;

  constructor() {
    this.client = createClient();
    this.client.connect();
    this.callback = {};
    this.init();
  }

  async init() {
    while (true) {
      const response = await this.client.xRead({
        key: "trade-stream-response",
        id: "$"
      }, {
        BLOCK: 0
      });

      if (!response) {
        continue;

      }
      const id = JSON.parse(response[0].messages[0]?.message.message).id
      this.callback[id](response[0].messages[0].message);
    }
  }

  waitForMessage(callbackId: string) {
    return new Promise(resolve => {
      this.callback[callbackId] = resolve;
    })
  }
}
