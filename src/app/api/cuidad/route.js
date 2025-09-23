const API_URL = "http://localhost:4000/api/v1/cities";

// Obtener todas las ciudades
export const fetchCiudades = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener ciudades");
  const json = await res.json();
  return json; // { status, data: [...] }
};

// Crear una nueva ciudad
export const crearCiudad = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear ciudad");
  const json = await res.json();
  return json; // { status, data: {...} }
};

// Editar una ciudad
export const editarCiudad = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar ciudad");
  const json = await res.json();
  return json;
};

// Eliminar una ciudad
export const eliminarCiudad = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar ciudad");
  const json = await res.json();
  return json;
};
