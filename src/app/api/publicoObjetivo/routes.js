const API_URL = "http://localhost:4000/api/v1/targetAudiences";

// Obtener todos los públicos objetivos
export const getPublicos = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener públicos objetivos");
  return res.json();
};

// Crear un público
export const createPublico = async (publico) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(publico),
  });
  if (!res.ok) throw new Error("Error al crear público objetivo");
  return res.json();
};

// Actualizar un público
export const updatePublico = async (id, publico) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(publico),
  });
  if (!res.ok) throw new Error("Error al actualizar público objetivo");
  return res.json();
};

// Eliminar un público
export const deletePublico = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar público objetivo");
  return res.json();
};
