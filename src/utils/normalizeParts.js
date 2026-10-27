const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const asArray = (value) => Array.isArray(value) ? value : [];

function normalizeGoods(goods) {
  return asArray(goods)
    .filter((part) => isObject(part) && [part.brand, part.number, part.name, part.goodsID]
      .some((value) => value !== undefined && value !== null && String(value).trim() !== ''))
    .map((part) => ({
      goodsID: part.goodsID ?? null,
      brand: part.brand ?? null,
      number: part.number ?? null,
      name: part.name ?? null,
      count: part.count ?? null,
      rate: part.rate ?? null,
      notRefund: part.notRefund ?? null,
      warehouses: asArray(part.warehouses).filter(isObject)
        .filter((warehouse) => Object.keys(warehouse).length > 0)
        .map((warehouse) => ({
          code: warehouse.code ?? null,
          id: warehouse.id ?? null,
          own: warehouse.own ?? null,
          price: warehouse.price ?? null,
          stock: warehouse.stock ?? null,
          shipmentDate: warehouse.shipmentDate ?? null,
          notRefund: warehouse.notRefund ?? null,
        })),
      analogues: normalizeGoods(part.analogues),
    }));
}

export function normalizeParts(response) {
  return normalizeGoods(response?.goods);
}

export function toOfferRows(parts) {
  return parts.flatMap((part) => part.warehouses.map((warehouse) => ({
    goodsID: part.goodsID,
    brand: part.brand,
    number: part.number,
    name: part.name,
    warehouse: warehouse.code ?? warehouse.id,
    price: warehouse.price,
    stock: warehouse.stock,
    shipmentDate: warehouse.shipmentDate,
    notRefund: warehouse.notRefund ?? part.notRefund,
    own: warehouse.own,
  })));
}

export function normalizePartDetails(response, brand) {
  const parts = normalizeParts(response).filter((part) => part.brand === brand);
  return {
    offers: toOfferRows(parts),
    analogues: toOfferRows(parts.flatMap((part) => part.analogues)),
  };
}
