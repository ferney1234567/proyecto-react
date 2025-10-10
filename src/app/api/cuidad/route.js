// src/api/ciudades/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/cities`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Adjunta el JWT si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Ciudades
// ============================

// Obtener todas las ciudades (pública o autenticada)
export const fetchCiudades = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener ciudades");
    const json = await res.json();
    return json; // { status, data: [...] }
  } catch (err) {
    console.error("❌ Error en fetchCiudades:", err);
    throw err;
  }
};

// Crear una nueva ciudad (requiere token)
export const crearCiudad = async (data) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear ciudad");
    const json = await res.json();
    return json; // { status, data: {...} }
  } catch (err) {
    console.error("❌ Error en crearCiudad:", err);
    throw err;
  }
};

// Editar una ciudad (requiere token)
export const editarCiudad = async (id, data) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al editar ciudad");
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("❌ Error en editarCiudad:", err);
    throw err;
  }
};

// Eliminar una ciudad (requiere token)
export const eliminarCiudad = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar ciudad");
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("❌ Error en eliminarCiudad:", err);
    throw err;
  }
};
