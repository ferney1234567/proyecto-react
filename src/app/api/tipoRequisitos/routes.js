// src/api/requirementGroups/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/requirementGroups`;

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
// 📍 CRUD de RequirementGroups
// ============================

// Obtener todos los grupos de requisitos (público o autenticado)
export const getRequirementGroups = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al cargar grupos de requisitos");
  } catch (err) {
    console.error("❌ Error en getRequirementGroups:", err);
    throw err;
  }
};

// Crear un grupo (requiere token)
export const createRequirementGroup = async (name, categoryId) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify({ name, categoryId }),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al crear grupo de requisitos");
  } catch (err) {
    console.error("❌ Error en createRequirementGroup:", err);
    throw err;
  }
};

// Actualizar un grupo (requiere token)
export const updateRequirementGroup = async (id, name, categoryId) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, categoryId }),
    });

    const data = await res.json();
    if (data.status === "Ok") return data.data;
    throw new Error(data.message || "Error al actualizar grupo de requisitos");
  } catch (err) {
    console.error("❌ Error en updateRequirementGroup:", err);
    throw err;
  }
};

// Eliminar un grupo (requiere token)
export const deleteRequirementGroup = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.status === "Ok") return true;
    throw new Error(data.message || "Error al eliminar grupo de requisitos");
  } catch (err) {
    console.error("❌ Error en deleteRequirementGroup:", err);
    throw err;
  }
};
