// src/api/convocatorias/routes.js

// ============================================================
// 🔧 URL base cargada desde .env
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================================
// 🧠 Helper para fetch con token (JWT)
// ============================================================
const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================================================
// 📌 Convocatorias
// ============================================================

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
export const createConvocatoria = async (convocatoria) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls`, {
      method: "POST",
      body: JSON.stringify(convocatoria),
    });

    const data = await res.json().catch(() => ({}));

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
export const updateConvocatoria = async (id, convocatoria) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${id}`, {
      method: "PUT",
      body: JSON.stringify(convocatoria),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar convocatoria");
    }

    return data;
  } catch (err) {
    console.error("❌ Error en updateConvocatoria:", err);
    throw err;
  }
};

// Eliminar convocatoria (requiere token)
export const deleteConvocatoria = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar convocatoria");
    }

    return data;
  } catch (err) {
    console.error("❌ Error en deleteConvocatoria:", err);
    throw err;
  }
};

// ============================================================
// 📌 Registrar click (SUMAR CONTADOR) — NUEVO
// ============================================================
export const registrarClick = async (callId) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${callId}/click`, {
      method: "POST",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Error registrando click");
    }

    return data;
  } catch (err) {
    console.error("❌ Error en registrarClick:", err);
    throw err;
  }
};

// ============================================================
// 📌 Catálogos auxiliares
// ============================================================

// Instituciones
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

// Líneas
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

// Públicos objetivo
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

// Intereses
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

// Usuarios
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

// =======================================
// 📌 Registrar un click en una convocatoria
// =======================================
export const registrarClickConvocatoriaAPI = async (callId, userId) => {
  try {
    const res = await fetchConToken(`${API_URL}/calls/${callId}/click`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("⚠️ Error registrando click:", data);
      throw new Error("Error al registrar click");
    }

    return data;
  } catch (err) {
    console.error("❌ Error en registrarClickConvocatoriaAPI:", err);
    throw err;
  }
};
