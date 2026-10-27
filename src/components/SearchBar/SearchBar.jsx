export default function SearchBar({ value, onChange, onSubmit, isSearching, validationError }) {
  return (
    <form className="search-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="part-number" className="search-label">Артикул детали</label>
      <div className="search-controls">
        <input
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
