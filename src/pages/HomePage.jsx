import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import PartCard from '../components/PartCard/PartCard.jsx';
import { setQuery, submitSearch } from '../features/search/searchSlice.js';
import { scrollToSearchResults } from '../utils/scroll.js';

export default function HomePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigationType = useNavigationType();
  const { query, submittedQuery } = useSelector((state) => state.search);
  const [validationError, setValidationError] = useState('');
  const { searchParts, searchResult } = useOutletContext();
  const { currentData, isUninitialized, isFetching, isError, error } = searchResult;
  const shouldScroll = useRef(false);
  const isEmptyResult = !isUninitialized && !isFetching && !isError && currentData?.length === 0;

  useEffect(() => {
    if (navigationType !== 'POP' && location.state?.scrollToTop) shouldScroll.current = false;
  }, [location.key, location.state, navigationType]);

  useEffect(() => {
    if (!shouldScroll.current || isUninitialized || isFetching) return;
    shouldScroll.current = false;
    const frame = requestAnimationFrame(() => scrollToSearchResults());
    return () => cancelAnimationFrame(frame);
  }, [currentData, isEmptyResult, isError, isFetching, isUninitialized, location.key]);

  function handleChange(value) {
    dispatch(setQuery(value));
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
    dispatch(submitSearch(number));
    shouldScroll.current = true;
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
              <h2 id="results-title">Артикул: <span>{submittedQuery}</span></h2>
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
                  <caption className="visually-hidden">Найденные детали по артикулу {submittedQuery}</caption>
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
