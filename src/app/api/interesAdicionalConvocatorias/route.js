// src/api/callAdditionalInterests/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/callAdditionalInterests`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Adjunta JWT si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de CallAdditionalInterests
// ============================

// Obtener todos los CallAdditionalInterests
export const getCallAdditionalInterests = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });

    // Si la respuesta es 404 o no hay registros, devolvemos un arreglo vacío sin lanzar error
    if (res.status === 404) {
      console.warn("⚠️ No hay CallAdditionalInterests registrados todavía.");
      return { data: [] }; // Evita que rompa el dashboard
    }

    if (!res.ok) {
      console.error("⚠️ Error al obtener CallAdditionalInterests:", res.statusText);
      return { data: [] }; // Devuelve vacío, pero no rompe
    }

    const json = await res.json();
    return json ?? { data: [] }; // Si no hay contenido, retorna vacío
  } catch (error) {
    console.error("❌ Error en getCallAdditionalInterests:", error);
    return { data: [] }; // Evita lanzar excepción
  }
};

// Crear un CallAdditionalInterest (requiere token)
export const createCallAdditionalInterest = async (body) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok)
      throw new Error("❌ Error al crear CallAdditionalInterest");

    return res.json();
  } catch (error) {
    console.error("❌ Error en createCallAdditionalInterest:", error);
    throw error;
  }
};

// Actualizar un CallAdditionalInterest (requiere token)
export const updateCallAdditionalInterest = async (callId, interestId, body) => {
  try {
    const res = await fetchConToken(`${API_URL}/${callId}/${interestId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!res.ok)
      throw new Error("❌ Error al actualizar CallAdditionalInterest");

    return res.json();
  } catch (error) {
    console.error("❌ Error en updateCallAdditionalInterest:", error);
    throw error;
  }
};

// Eliminar un CallAdditionalInterest (requiere token)
export const deleteCallAdditionalInterest = async (callId, interestId) => {
  try {
    const res = await fetchConToken(`${API_URL}/${callId}/${interestId}`, {
      method: "DELETE",
    });

    if (!res.ok)
      throw new Error("❌ Error al eliminar CallAdditionalInterest");

    return res.json();
  } catch (error) {
    console.error("❌ Error en deleteCallAdditionalInterest:", error);
    throw error;
  }
};
