const API_URL = "http://localhost:4000/api/v1/requirementCategories";

// Obtener todas las categorías
export const getCategorias = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
};

// Crear categoría
export const createCategoria = async (categoria) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error("Error al crear categoría");
  return res.json();
};

// Actualizar categoría
export const updateCategoria = async (id, categoria) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  if (!res.ok) throw new Error("Error al actualizar categoría");
  return res.json();
};

// Eliminar categoría
export const deleteCategoria = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar categoría");
  return res.json();
};
