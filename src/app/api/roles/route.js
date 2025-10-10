// src/api/roles/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/roles`;

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
// 📍 CRUD de Roles
// ============================

// Obtener todos los roles (público o autenticado)
export const getRoles = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al cargar roles");
  } catch (err) {
    console.error("❌ Error en getRoles:", err);
    throw err;
  }
};

// Crear un rol (requiere token)
export const createRole = async (name) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al crear el rol");
  } catch (err) {
    console.error("❌ Error en createRole:", err);
    throw err;
  }
};

// Actualizar un rol (requiere token)
export const updateRole = async (id, name) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al actualizar el rol");
  } catch (err) {
    console.error("❌ Error en updateRole:", err);
    throw err;
  }
};

// Eliminar un rol (requiere token)
export const deleteRole = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.status === "Ok") return true;
    throw new Error(data.message || "Error al eliminar el rol");
  } catch (err) {
    console.error("❌ Error en deleteRole:", err);
    throw err;
  }
};
