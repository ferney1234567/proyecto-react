// src/api/requirementChecks/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/requirementChecks`;

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
// 📍 CRUD de RequirementChecks
// ============================

// Obtener todos los registros (público o autenticado)
export const getRequirementChecks = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    const data = await res.json();
    if (data.status === "Ok") return data.data;
    return [];
  } catch (err) {
    console.error("❌ Error en getRequirementChecks:", err);
    return [];
  }
};

// Crear un registro (requiere token)
export const createRequirementCheck = async (
  is_checked,
  companyId,
  requirementId,
  userId
) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify({
        isChecked: !!is_checked,
        companyId,
        requirementId,
        userId,
      }),
    });

    if (!res.ok) throw new Error("Error al crear RequirementCheck");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en createRequirementCheck:", err);
    throw err;
  }
};

// Actualizar un registro (requiere token)
export const updateRequirementCheck = async (
  id,
  is_checked,
  companyId,
  requirementId,
  userId
) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        isChecked: !!is_checked,
        companyId,
        requirementId,
        userId,
      }),
    });

    if (!res.ok) throw new Error("Error al actualizar RequirementCheck");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en updateRequirementCheck:", err);
    throw err;
  }
};

// Eliminar un registro (requiere token)
export const deleteRequirementCheck = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar RequirementCheck");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en deleteRequirementCheck:", err);
    throw err;
  }
};
