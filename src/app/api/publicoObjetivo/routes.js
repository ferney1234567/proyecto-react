// src/api/publicos/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/targetAudiences`;

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
// 📍 CRUD de Públicos Objetivo
// ============================

// Obtener todos los públicos objetivos (pública o autenticada)
export const getPublicos = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener públicos objetivos");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getPublicos:", err);
    throw err;
  }
};

// Crear un público objetivo (requiere token)
export const createPublico = async (publico) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(publico),
    });

    if (!res.ok) throw new Error("Error al crear público objetivo");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createPublico:", err);
    throw err;
  }
};

// Actualizar un público objetivo (requiere token)
export const updatePublico = async (id, publico) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(publico),
    });

    if (!res.ok) throw new Error("Error al actualizar público objetivo");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updatePublico:", err);
    throw err;
  }
};

// Eliminar un público objetivo (requiere token)
export const deletePublico = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar público objetivo");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deletePublico:", err);
    throw err;
  }
};
