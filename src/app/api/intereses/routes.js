const API_URL = "http://localhost:4000/api/v1/interests";

// Obtener todos los intereses
export const getIntereses = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener intereses");
  return res.json();
};

// Crear interés
export const createInteres = async (interes) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interes),
  });
  if (!res.ok) throw new Error("Error al crear interés");
  return res.json();
};

// Actualizar interés
export const updateInteres = async (id, interes) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interes),
  });
  if (!res.ok) throw new Error("Error al actualizar interés");
  return res.json();
};

// Eliminar interés
export const deleteInteres = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar interés");
  return res.json();
};
