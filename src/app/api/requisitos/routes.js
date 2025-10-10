// src/api/requisitos/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/requirements`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Adjunta el token si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Requisitos
// ============================

// Obtener todos los requisitos (público o autenticado)
export const getRequisitos = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });

    // ✅ devolvemos [] si no hay registros
    if (res.status === 204 || res.status === 404) return [];

    if (!res.ok) throw new Error(`Error al cargar requisitos: ${res.status}`);

    const data = await res.json();

    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("❌ getRequisitos error:", error);
    return []; // nunca rompemos el front
  }
};

// Crear requisito (requiere token)
export const createRequisito = async (requisito) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(requisito),
    });

    if (!res.ok) throw new Error("Error al crear requisito");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createRequisito:", err);
    throw err;
  }
};

// Actualizar requisito (requiere token)
export const updateRequisito = async (id, requisito) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(requisito),
    });

    if (!res.ok) throw new Error("Error al actualizar requisito");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateRequisito:", err);
    throw err;
  }
};

// Eliminar requisito (requiere token)
export const deleteRequisito = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar requisito");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteRequisito:", err);
    throw err;
  }
};
