import { useNavigate, useParams } from 'react-router-dom';
import PartsTable from '../components/PartsTable/PartsTable.jsx';
import AnaloguesTable from '../components/AnaloguesTable/AnaloguesTable.jsx';
import { useGetPartDetailsQuery } from '../services/favoritApi.js';

export default function PartDetailsPage() {
  const { brand, number } = useParams();
  const navigate = useNavigate();
  const { currentData, isFetching, isError, error } = useGetPartDetailsQuery({ brand, number });

  function handleBack() {
    if (Number.isInteger(window.history.state?.idx) && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="part-details-page" aria-busy={isFetching}>
      <button type="button" className="details-back" onClick={handleBack}>← Назад</button>
      <div className="page-label">Предложения поставщика</div>
      <h1>Цены и аналоги</h1>
      <div className="details-identity">
        <strong>{brand}</strong>
        <span>Артикул: {number}</span>
      </div>
      {isFetching && (
        <p className="details-status" role="status">
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          Загружаем предложения и аналоги…
        </p>
      )}
      {!isFetching && isError && (
        <div className="alert alert-danger details-status" role="alert">
          {error?.error || 'Не удалось загрузить предложения и аналоги.'}
        </div>
      )}
      {!isFetching && !isError && currentData && (
        <>
          <p className="details-note">Дата отгрузки и время приведены по данным поставщика.</p>
          <PartsTable
            id="manufacturer-offers"
            title={`Предложения ${brand}`}
            rows={currentData.offers}
            emptyMessage="Складские предложения выбранного производителя не найдены."
          />
          <AnaloguesTable analogues={currentData.analogues} />
        </>
      )}
    </div>
  );
}
