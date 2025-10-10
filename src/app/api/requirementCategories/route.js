// src/api/categorias/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/requirementCategories`;

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
// 📍 CRUD de Categorías de Requisitos
// ============================

// Obtener todas las categorías (pública o autenticada)
export const getCategorias = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getCategorias:", err);
    throw err;
  }
};

// Crear categoría (requiere token)
export const createCategoria = async (categoria) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(categoria),
    });

    if (!res.ok) throw new Error("Error al crear categoría");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createCategoria:", err);
    throw err;
  }
};

// Actualizar categoría (requiere token)
export const updateCategoria = async (id, categoria) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoria),
    });

    if (!res.ok) throw new Error("Error al actualizar categoría");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateCategoria:", err);
    throw err;
  }
};

// Eliminar categoría (requiere token)
export const deleteCategoria = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar categoría");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteCategoria:", err);
    throw err;
  }
};
