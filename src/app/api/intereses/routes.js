// src/api/intereses/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/interests`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Incluye el token si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Intereses
// ============================

// Obtener todos los intereses (pública o autenticada)
export const getIntereses = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener intereses");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getIntereses:", err);
    throw err;
  }
};

// Crear interés (requiere token)
export const createInteres = async (interes) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(interes),
    });

    if (!res.ok) throw new Error("Error al crear interés");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createInteres:", err);
    throw err;
  }
};

// Actualizar interés (requiere token)
export const updateInteres = async (id, interes) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(interes),
    });

    if (!res.ok) throw new Error("Error al actualizar interés");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateInteres:", err);
    throw err;
  }
};

// Eliminar interés (requiere token)
export const deleteInteres = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar interés");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteInteres:", err);
    throw err;
  }
};
