// src/api/instituciones/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/institutions`;

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
// 📍 CRUD de Instituciones
// ============================

// Obtener todas las instituciones (pública o autenticada)
export const getInstituciones = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener instituciones");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getInstituciones:", err);
    throw err;
  }
};

// Crear institución (requiere token)
export const createInstitucion = async (institucion) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(institucion), // { name, website }
    });
    if (!res.ok) throw new Error("Error al crear institución");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createInstitucion:", err);
    throw err;
  }
};

// Actualizar institución (requiere token)
export const updateInstitucion = async (id, institucion) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(institucion),
    });
    if (!res.ok) throw new Error("Error al actualizar institución");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateInstitucion:", err);
    throw err;
  }
};

// Eliminar institución (requiere token)
export const deleteInstitucion = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar institución");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteInstitucion:", err);
    throw err;
  }
};
