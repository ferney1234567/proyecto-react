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


// Crear
export const createConvocatoria = async (conv) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conv),
  });
  if (!res.ok) throw new Error("Error al crear convocatoria");
  return res.json();
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
