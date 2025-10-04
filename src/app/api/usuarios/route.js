const API_URL = "http://localhost:4000/api/v1/users";

// 🔹 Obtener todos los usuarios
export const getUsers = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  const data = await res.json();
  if (data.status === "Ok") return data.data;
  throw new Error(data.message || "Error al cargar usuarios");
};

// 🔹 Crear usuario
export const createUser = async (usuario) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  const data = await res.json();
  if (data.status === "Ok") return data.data;
  throw new Error(data.message || "Error al crear usuario");
};

// 🔹 Actualizar usuario
export const updateUser = async (id, usuario) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  const data = await res.json();
  if (data.status === "Ok") return data.data;
  throw new Error(data.message || "Error al actualizar usuario");
};

// 🔹 Eliminar usuario
export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (data.status === "Ok") return true;
  throw new Error(data.message || "Error al eliminar usuario");
};
