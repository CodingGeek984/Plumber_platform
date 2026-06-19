const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

const TOKEN_KEY = 'sst_token';
const USER_KEY = 'sst_me';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) ?? null;
  } catch {
    return null;
  }
};

export const persistSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const extractErrorMessage = (payload, fallback) => {
  if (typeof payload === 'string' && payload.trim()) return payload;
  if (Array.isArray(payload) && payload.length > 0) return extractErrorMessage(payload[0], fallback);
  if (isObject(payload?.errors)) {
    const firstError = Object.values(payload.errors)[0];
    return extractErrorMessage(firstError, fallback);
  }
  if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message;
  return fallback;
};

export const apiRequest = async (path, { method = 'GET', body, token, headers } = {}) => {
  const sessionToken = token ?? getStoredToken();
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';
  if (sessionToken) requestHeaders.Authorization = `Bearer ${sessionToken}`;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Не удалось подключиться к серверу Laravel. Проверь `VITE_API_URL` и запуск backend.');
  }

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, 'Ошибка запроса к серверу'));
  }

  return payload;
};

export const mapUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status ?? null,
  createdAt: user.created_at ?? user.createdAt ?? null,
  serviceRequestsCount: user.service_requests_count ?? user.serviceRequestsCount ?? 0,
  assignedRequestsCount: user.assigned_requests_count ?? user.assignedRequestsCount ?? 0,
});

export const mapRequest = (request) => ({
  id: request.id,
  clientId: request.client_id ?? request.clientId,
  clientName: request.client_name ?? request.clientName ?? request.client?.name ?? 'Клиент',
  clientPhone: request.client_phone ?? request.clientPhone ?? '',
  service: request.service,
  description: request.description ?? '',
  status: request.status ?? 'pending',
  assignedTo: request.assigned_to ?? request.assignedTo ?? request.employee?.id ?? null,
  assignedName: request.assigned_name ?? request.assignedName ?? request.employee?.name ?? null,
  createdAt: request.created_at ?? request.createdAt ?? new Date().toISOString(),
});
