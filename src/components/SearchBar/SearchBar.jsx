import { useRef } from 'react';

export default function SearchBar({ value, onChange, onSubmit, onClear, canClear, isSearching, validationError }) {
  const inputRef = useRef(null);

  function handleClear() {
    onClear();
    inputRef.current?.focus();
  }

  return (
    <form className="search-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="part-number" className="search-label">Артикул детали</label>
      <div className="search-controls">
        <div className="search-input-wrap">
          <input
            ref={inputRef}
            id="part-number"
            name="number"
            className="form-control search-input"
            type="text"
            placeholder="Например, 0986424794"
            autoComplete="off"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'search-validation' : 'search-hint'}
          />
          {canClear && (
            <button type="button" className="search-clear" aria-label="Сбросить поиск" onClick={handleClear}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="btn search-button" disabled={isSearching}>
          {isSearching && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
          Найти
        </button>
      </div>
      {validationError
        ? <p id="search-validation" className="search-hint" role="alert">{validationError}</p>
        : <p id="search-hint" className="search-hint">Введите артикул с упаковки или самой детали.</p>}
    </form>
  );
}
