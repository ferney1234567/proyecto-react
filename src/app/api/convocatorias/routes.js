// src/api/convocatorias/routes.js
const API_URL = "http://localhost:4000/api/v1/calls";

// Obtener todas
export const getConvocatorias = async () => {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
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


export const createConvocatoria = async (conv) => {
  const res = await fetch("http://localhost:4000/api/v1/calls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conv),
  });

  const data = await res.json();

  if (!res.ok || data.status === "Error") {
    throw new Error(data.message || "Error al crear convocatoria");
  }

  return data;
};



// Actualizar
export const updateConvocatoria = async (id, conv) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conv),
  });
  if (!res.ok) throw new Error("Error al actualizar convocatoria");
  return res.json();
};

// Eliminar
export const deleteConvocatoria = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar convocatoria");
  return res.json();
};


const BASE_URL = "http://localhost:4000/api/v1";

export const getEntidades = async () => {
  const res = await fetch(`${BASE_URL}/institutions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener entidades");
  return res.json();
};

export const getLineas = async () => {
  const res = await fetch(`${BASE_URL}/lines`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener líneas");
  return res.json();
};

export const getPublicos = async () => {
  const res = await fetch(`${BASE_URL}/targets`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener públicos");
  return res.json();
};

export const getIntereses = async () => {
  const res = await fetch(`${BASE_URL}/interests`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener intereses");
  return res.json();
};

export const getUsuarios = async () => {
  const res = await fetch(`${BASE_URL}/users`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};
