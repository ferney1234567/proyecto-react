// src/api/lineas/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/lines`;

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
// 📍 CRUD de Líneas
// ============================

// Obtener todas las líneas (pública o autenticada)
export const getLineas = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener líneas");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getLineas:", err);
    throw err;
  }
};

// Crear una línea (requiere token)
export const createLinea = async (linea) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(linea),
    });

    if (!res.ok) throw new Error("Error al crear línea");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createLinea:", err);
    throw err;
  }
};

// Actualizar una línea (requiere token)
export const updateLinea = async (id, linea) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(linea),
    });

    if (!res.ok) throw new Error("Error al actualizar línea");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateLinea:", err);
    throw err;
  }
};

// Eliminar una línea (requiere token)
export const deleteLinea = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar línea");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteLinea:", err);
    throw err;
  }
};
