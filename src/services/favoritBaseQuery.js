import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export function createFavoritBaseQuery({ baseUrl, apiKey, fetchFn }) {
  const rawBaseQuery = fetchBaseQuery({ baseUrl, fetchFn, timeout: 15000 });

  return async (args, api, extraOptions) => {
    if (!apiKey?.trim()) {
      return { error: { status: 'CUSTOM_ERROR', error: 'Не задан тестовый API-ключ.', data: { code: 'MISSING_API_KEY' } } };
    }
    if (!args.params.number?.trim() || ('brand' in args.params && !args.params.brand?.trim())) {
      return { error: { status: 'CUSTOM_ERROR', error: 'Укажите артикул и, для деталей, производителя.', data: { code: 'INVALID_QUERY' } } };
    }

    const result = await rawBaseQuery({ ...args, params: { ...args.params, key: apiKey } }, api, extraOptions);
    // Не передаём Request/Response и исходные ошибки в Redux: URL содержит ключ.
    if (result.error) {
      const status = result.error.status;
      return { error: { status, error: typeof status === 'number'
        ? `Ошибка HTTP ${status}.`
        : status === 'PARSING_ERROR' ? 'API вернул некорректный JSON.'
          : status === 'TIMEOUT_ERROR' ? 'Время ожидания API истекло.'
            : 'Не удалось выполнить запрос к API. Проверьте сеть и ограничения браузера.' } };
    }
    const response = result.data;
    if (response && typeof response === 'object' && Object.hasOwn(response, 'error')) {
      return { error: { status: 'CUSTOM_ERROR', error: 'API Favorit Parts вернул ошибку.', data: { code: 'API_ERROR' } } };
    }
    if (!response || typeof response !== 'object' || Array.isArray(response)
      || (response.goods !== undefined && !Array.isArray(response.goods))
      || (response.goods === undefined && Object.keys(response).length > 0)) {
      return { error: { status: 'CUSTOM_ERROR', error: 'Неожиданная структура ответа API.', data: { code: 'INVALID_RESPONSE' } } };
    }
    return { data: response };
  };
}
