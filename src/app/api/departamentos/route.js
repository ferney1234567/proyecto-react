// services/departamentoService.js
const API_URL = "http://localhost:4000/api/v1/departments";

// Obtener todos los departamentos
export const fetchDepartamentos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener departamentos");
  const json = await res.json();
  return json.data || []; // 👈 siempre devuelvo array de departamentos
};

// Crear un nuevo departamento
export const crearDepartamento = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear departamento");
  const json = await res.json();
  return json.data; // 👈 devuelvo solo el nuevo depto
};

// Editar un departamento
export const editarDepartamento = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al editar departamento");
  const json = await res.json();
  return json.data; // 👈 devuelvo solo el depto actualizado
};

// Eliminar un departamento
export const eliminarDepartamento = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar departamento");
  const json = await res.json();
  return json.data; // 👈 devuelvo el objeto eliminado si tu API lo envía
};
