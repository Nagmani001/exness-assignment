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




  }

  closeTrade(orderId: string) {

  }

  setCurrentPrice(currentPrice: any) {
    this.currentPrice = currentPrice;
  }

  liquidaateTrade() {
    setInterval(() => {

    }, 100);
  }
}
