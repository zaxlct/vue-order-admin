export const orderAmount = state => {
  const amount = state.orderDetail.reduce((num, prev) => {
    let profit = (prev.profit + 100) / 100
    return num + (prev.price * prev.num * profit)
  }, 0)

  return Number(amount.toFixed(2))
}

export const orderSpList = state => state.orderDetail.map(goods => goods.sku + '@' + goods.profit + '@' + goods.num).join(',')

