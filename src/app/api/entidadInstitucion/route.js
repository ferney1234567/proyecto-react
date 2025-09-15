const API_URL = "http://localhost:4000/api/v1/institutions";

// Obtener todas las instituciones
export const getInstituciones = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener instituciones");
  return res.json();
};

// Crear institución
export const createInstitucion = async (institucion) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(institucion), // { name, website }
  });
  if (!res.ok) throw new Error("Error al crear institución");
  return res.json();
};

// Actualizar institución
export const updateInstitucion = async (id, institucion) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(institucion),
  });
  if (!res.ok) throw new Error("Error al actualizar institución");
  return res.json();
};

// Eliminar institución
export const deleteInstitucion = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar institución");
  return res.json();
};
