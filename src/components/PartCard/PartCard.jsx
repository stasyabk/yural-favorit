import { Link } from 'react-router-dom';

export default function PartCard({ part }) {
  const canOpenDetails = Boolean(part.brand && part.number);
  const detailsPath = canOpenDetails
    ? `/parts/${encodeURIComponent(part.brand)}/${encodeURIComponent(part.number)}`
    : null;

  return (
    <tr className="part-row">
      <td className="part-brand">{part.brand || 'Производитель не указан'}</td>
      <td className="part-number">{part.number || 'Артикул не указан'}</td>
      <td className="part-name">{part.name || 'Наименование не указано'}</td>
      <td className="part-action">
        {canOpenDetails
          ? <Link className="btn part-details-link" to={detailsPath}>Посмотреть цены</Link>
          : <button className="btn part-details-link" type="button" disabled>Посмотреть цены</button>}
      </td>
    </tr>
  );
}
