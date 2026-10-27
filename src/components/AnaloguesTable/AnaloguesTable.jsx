import { Link } from 'react-router-dom';
import { formatValue } from '../../utils/formatters.js';

export default function AnaloguesTable({ analogues }) {
  return (
    <section className="offers-section" aria-labelledby="analogues-title">
      <h2 id="analogues-title">Аналоги</h2>
      {analogues.length === 0 ? <p className="offers-empty">Аналоги не найдены.</p> : (
        <div className="results-list">
          <table className="table results-table analogues-table mb-0">
            <caption className="visually-hidden">Уникальные аналоги по производителю и артикулу</caption>
            <thead>
              <tr>
                <th scope="col">Производитель</th>
                <th scope="col">Артикул</th>
                <th scope="col">Наименование</th>
                <th scope="col">Наличие</th>
              </tr>
            </thead>
            <tbody>
              {analogues.map((analogue) => (
                <tr className="part-row" key={JSON.stringify([analogue.brand, analogue.number])}>
                  <td className="part-brand">{formatValue(analogue.brand)}</td>
                  <td className="part-number">{formatValue(analogue.number)}</td>
                  <td className="part-name">{formatValue(analogue.name)}</td>
                  <td className="part-action">
                    <Link
                      className="btn part-details-link"
                      to={`/parts/${encodeURIComponent(analogue.brand)}/${encodeURIComponent(analogue.number)}`}
                    >Посмотреть наличие</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
