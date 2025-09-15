const API_URL = 'http://localhost:4000/api/v1/roles';

// Obtener todos los roles
export const getRoles = async () => {
  const res = await fetch(API_URL, { cache: 'no-store' }); // evita cache en Next.js
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al cargar roles');
};

// Crear un rol
export const createRole = async (name) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al crear el rol');
};

// Actualizar un rol
export const updateRole = async (id, name) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al actualizar el rol');
};

// Eliminar un rol
export const deleteRole = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.status === 'Ok') return true;
  throw new Error(data.message || 'Error al eliminar el rol');
};
