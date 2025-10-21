// utils/api.js
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");
  const isFormData = options.body instanceof FormData;
  const isStringBody = typeof options.body === "string";

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`http://localhost:5000${endpoint}`, {
    ...options,
    headers,
    body: isFormData
      ? options.body
      : options.body && !isStringBody
      ? JSON.stringify(options.body) // ✅ Solo stringify si es objeto
      : options.body, // ✅ Si ya es string o FormData, se manda directo
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  try {
    return await res.json();
  } catch {
    return null; // Si la respuesta no tiene JSON
  }
} 