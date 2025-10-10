// src/api/convocatorias/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
// 📌 Convocatorias
// ============================

// Obtener todas las convocatorias
export const getConvocatorias = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/calls`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("⚠️ Error HTTP:", res.status, data);
      throw new Error(`Error al obtener convocatorias: ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("❌ Error en getConvocatorias:", err);
    throw err;
  }
};

// Crear convocatoria (requiere token)
export const createConvocatoria = async (conv) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls`, {
      method: "POST",
      body: JSON.stringify(conv),
    });

    const data = await res.json();

    if (!res.ok || data.status === "Error") {
      throw new Error(data.message || "Error al crear convocatoria");
    }

    return data;
  } catch (err) {
    console.error("❌ Error en createConvocatoria:", err);
    throw err;
  }
};

// Actualizar convocatoria (requiere token)
export const updateConvocatoria = async (id, conv) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${id}`, {
      method: "PUT",
      body: JSON.stringify(conv),
    });

    if (!res.ok) throw new Error("Error al actualizar convocatoria");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateConvocatoria:", err);
    throw err;
  }
};

// Eliminar convocatoria (requiere token)
export const deleteConvocatoria = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar convocatoria");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteConvocatoria:", err);
    throw err;
  }
};

// ============================
// 📌 Catálogos auxiliares
// ============================

export const getEntidades = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/institutions`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener entidades");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getEntidades:", err);
    throw err;
  }
};

export const getLineas = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/lines`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener líneas");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getLineas:", err);
    throw err;
  }
};

export const getPublicos = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/targets`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener públicos");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getPublicos:", err);
    throw err;
  }
};

export const getIntereses = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/interests`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener intereses");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getIntereses:", err);
    throw err;
  }
};

export const getUsuarios = async () => {
  try {
    const res = await fetchConToken(`${API_URL}/users`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getUsuarios:", err);
    throw err;
  }
};
