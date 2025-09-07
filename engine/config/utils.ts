import type { OpenOrders } from "../types/type";

export function profitOrLoss(currentPrice: number, order: OpenOrders) {
  const originalValue = order.price * order.quantity;
  const currentValue = currentPrice * order.quantity;
  if (currentValue > originalValue) {
    return {
      type: "profit",
      value: currentValue - originalValue
    }
  } else {
    return {
      type: "loss",
      value: originalValue - currentValue
    }
  }
}
