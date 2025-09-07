export interface User {
  email: string,
  balances: {
    [key: string]: number
  }
}

export interface OpenOrders {
  id: string,
  userId: string,
  type: string, // buy | sell , long | short
  asset: string, // BTC | ETH | SOL
  price: number,
  quantity: number
  takeProfit?: number
  stopLoss?: number
}

export interface Trades {
  id: string,
  userId: string,
  type: string, // buy | sell , long | short
  asset: string, // BTC | ETH | SOL
  price: number,
  quantity: number
  closePrice: number
}

