// src/api/favoritos/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/favorites`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Agrega el token JWT si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Favoritos
// ============================

// === Obtener todos los favoritos (pública o autenticada)
export const getFavoritos = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || "Error al obtener favoritos");
    return data;
  } catch (error) {
    console.error("❌ Error en getFavoritos:", error);
    throw error;
  }
};

// === Crear favorito (requiere token)
export const createFavorito = async (favorito) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(favorito),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al crear favorito: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ Error en createFavorito:", error);
    throw error;
  }
};

// === Eliminar favorito (requiere token)
export const deleteFavorito = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al eliminar favorito: ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ Error en deleteFavorito:", error);
    throw error;
  }
};
