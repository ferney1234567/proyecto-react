const API_URL = "http://localhost:4000/api/v1/lines";

// Obtener todas las líneas
export const getLineas = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener líneas");
  return res.json();
};

// Crear una línea
export const createLinea = async (linea) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(linea),
  });
  if (!res.ok) throw new Error("Error al crear línea");
  return res.json();
};

// Actualizar una línea
export const updateLinea = async (id, linea) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(linea),
  });
  if (!res.ok) throw new Error("Error al actualizar línea");
  return res.json();
};

// Eliminar una línea
export const deleteLinea = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar línea");
  return res.json();
};
