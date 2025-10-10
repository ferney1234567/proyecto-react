// src/api/users/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/users`;

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
// 📍 CRUD de Usuarios
// ============================

// 🔹 Obtener todos los usuarios (público o autenticado)
export const getUsers = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al cargar usuarios");
  } catch (err) {
    console.error("❌ Error en getUsers:", err);
    throw err;
  }
};

// 🔹 Crear usuario (requiere token si el backend lo exige)
export const createUser = async (usuario) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(usuario),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al crear usuario");
  } catch (err) {
    console.error("❌ Error en createUser:", err);
    throw err;
  }
};

// 🔹 Actualizar usuario (requiere token)
export const updateUser = async (id, usuario) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al actualizar usuario");
  } catch (err) {
    console.error("❌ Error en updateUser:", err);
    throw err;
  }
};

// 🔹 Eliminar usuario (requiere token)
export const deleteUser = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.status === "Ok") return true;
    throw new Error(data.message || "Error al eliminar usuario");
  } catch (err) {
    console.error("❌ Error en deleteUser:", err);
    throw err;
  }
};
