import type { OpenOrders, User } from "../types/type";

export class TradeManager {
  users: User[];
  openOrders: OpenOrders[];
  currentPrice: any;

  constructor() {
    this.users = [];
    this.openOrders = [];
  }


  initializeBalance(email: string) {
    this.users.push({
      email,
      balances: {
        "USD": 500000
      }
    });
  }

  setCurrentPrice(currentPrice: any) {
    this.currentPrice = currentPrice;
  }

  getUsdBalance(email: string) {
    const user = this.users.find(x => x.email == email);
    return user?.balances["USD"];
  }

  getBalance(email: string) {
    const user = this.users.find(x => x.email == email);
    return user?.balances;

  }

  createTrade(email: string, asset: string, type: string, margin: number, leverage: number, slippage: number) {
    const user = this.users.find(x => x.email == email);

    if (user.balances["USD"] < margin) {
      return "Insufficient funds";
    }

    user.balances["USD"] -= margin;

    const orderId = crypto.randomUUID();

    const currentAssetPrice = this.currentPrice.find((x: any) => x.asset == asset).price;
    const userLeverage = margin * leverage;
    const userQuantityLeverage = (userLeverage / currentAssetPrice).toFixed(8);


    if (type == "long") {
      this.openOrders.push({
        id: orderId,
        email,
        type,
        asset,
        price: currentAssetPrice + 50,
        quantity: parseFloat(userQuantityLeverage),
      });
    } else {
      this.openOrders.push({
        id: orderId,
        email,
        type,
        asset,
        price: currentAssetPrice - 50,
        quantity: parseFloat(userQuantityLeverage),
      });
    }

    return orderId;
  }

  closeTrade(orderId: string) {
    const order = this.openOrders.find(x => x.id == orderId);
    const currentAssetPrice = this.currentPrice.find((x: any) => x.asset == order?.asset).price;

    const trade = {
      ...order,
      pnl: 23
    };

  }

  liquidaateTrade() {
    setInterval(() => {

    }, 100);
  }
}
