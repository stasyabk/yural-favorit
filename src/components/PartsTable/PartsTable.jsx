import { formatPrice, formatValue } from '../../utils/formatters.js';

export default function PartsTable({ id, title, rows, emptyMessage }) {
  return (
    <section className="offers-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {rows.length === 0 ? <p className="offers-empty">{emptyMessage}</p> : (
        <div className="table-responsive offers-scroll" role="region" aria-label={title} tabIndex={0}>
          <table className="table offers-table mb-0">
            <caption className="visually-hidden">{title}: одна строка на складское предложение</caption>
            <thead>
              <tr>
                <th scope="col">Производитель</th>
                <th scope="col">Артикул</th>
                <th scope="col">Наименование</th>
                <th scope="col">Цена</th>
                <th scope="col">Остаток</th>
                <th scope="col">Склад</th>
                <th scope="col">Дата отгрузки</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.goodsID ?? ''}-${row.brand}-${row.number}-${row.warehouse ?? ''}-${index}`}>
                  <td className="offer-brand">{formatValue(row.brand)}</td>
                  <td className="offer-number">{formatValue(row.number)}</td>
                  <td>{formatValue(row.name)}</td>
                  <td className="offer-price">{formatPrice(row.price)}</td>
                  <td>{formatValue(row.stock)}</td>
                  <td>{formatValue(row.warehouse)}</td>
                  <td>{formatValue(row.shipmentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
