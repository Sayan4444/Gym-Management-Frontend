let baseUrl = window.location.origin;
if (import.meta.env.DEV) {
  baseUrl = "http://localhost:8080"
}

export const API_BASE_URL = baseUrl + "/api"

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      // Find uppercase letters and replace with _lowercase
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return obj;
}

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Start with standard options
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  // Safely initialize headers as a plain object or Headers instance
  const headers = new Headers(options?.headers);

  // Intercept the body to convert camelCase to snake_case
  if (fetchOptions.body && typeof fetchOptions.body === 'string') {
    // Only default to application/json if we are actually sending a string payload
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      // Parse the stringified payload back to an object
      const parsedBody = JSON.parse(fetchOptions.body);
      // Convert keys and stringify again for the backend
      fetchOptions.body = JSON.stringify(toSnakeCase(parsedBody));
    } catch (e) {
      console.warn("Failed to parse request body for snake_case conversion", e);
    }
  }

  // Ensure we always expect JSON back (optional, but good practice)
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Attach the safely merged headers back to the options
  fetchOptions.headers = headers;

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Convert the snake_case response back to camelCase for the frontend
  const data = await response.json();
  return toCamelCase(data);
}