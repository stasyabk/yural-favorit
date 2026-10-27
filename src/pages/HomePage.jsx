import { useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import PartCard from '../components/PartCard/PartCard.jsx';
import { useLazyGetPartsByNumberQuery } from '../services/favoritApi.js';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [searchParts, { currentData, originalArgs, isUninitialized, isFetching, isError, error }] =
    useLazyGetPartsByNumberQuery();
  const isEmptyResult = !isUninitialized && !isFetching && !isError && currentData?.length === 0;

  function handleChange(value) {
    setQuery(value);
    setValidationError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const number = query.trim();
    if (!number) {
      setValidationError('Введите артикул детали.');
      return;
    }
    setValidationError('');
    setQuery(number);
    searchParts(number);
  }

  return (
    <div className="home-page">
      <section className="search-hero" aria-labelledby="search-title">
        <div className="container hero-content">
          <div className="hero-eyebrow">YURAL FAVORIT · Автозапчасти</div>
          <h1 id="search-title">Поиск автозапчастей</h1>
          <p className="hero-description">Найдите нужную деталь по артикулу.<br />
            Предложения производителей и аналоги — в одном месте.</p>
          <SearchBar
            value={query}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSearching={isFetching}
            validationError={validationError}
          />
        </div>
      </section>

      {!isUninitialized && (
        <section
          className="container search-results"
          aria-labelledby={isEmptyResult ? undefined : 'results-title'}
          aria-label={isEmptyResult ? 'Результаты поиска' : undefined}
          aria-busy={isFetching}
        >
          {!isEmptyResult && (
            <>
              <div className="page-label">Результаты поиска</div>
              <h2 id="results-title">Артикул: <span>{originalArgs}</span></h2>
            </>
          )}
          <div aria-live="polite" aria-atomic="true">
            {isFetching && <p className="search-status" role="status">Ищем детали…</p>}
            {!isFetching && isError && (
              <div className="alert alert-danger search-status" role="alert">
                {error?.error || 'Не удалось выполнить поиск. Попробуйте ещё раз.'}
              </div>
            )}
            {isEmptyResult && (
              <p className="search-status" role="status">По вашему запросу ничего не найдено</p>
            )}
            {!isFetching && !isError && currentData?.length > 0 && (
              <p className="results-count">Найдено позиций: {currentData.length}</p>
            )}
          </div>
          {!isFetching && !isError && currentData?.length > 0 && (
            <>
              <div className="results-list">
                <table className="table results-table mb-0">
                  <caption className="visually-hidden">Найденные детали по артикулу {originalArgs}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Производитель</th>
                      <th scope="col">Артикул</th>
                      <th scope="col">Наименование</th>
                      <th scope="col">Посмотреть цены</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((part, index) => (
                      <PartCard part={part} key={`${part.goodsID ?? ''}-${part.brand}-${part.number}-${index}`} />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
