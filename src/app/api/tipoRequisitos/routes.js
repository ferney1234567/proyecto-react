const API_URL = 'http://localhost:4000/api/v1/requirementGroups';

// Obtener todos los RequirementGroups
export const getRequirementGroups = async () => {
  const res = await fetch(API_URL, { cache: 'no-store' });
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al cargar grupos de requisitos');
};

// Crear un RequirementGroup
export const createRequirementGroup = async (name, categoryId) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, categoryId }),
  });
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al crear grupo de requisitos');
};

// Actualizar un RequirementGroup
export const updateRequirementGroup = async (id, name, categoryId) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, categoryId }),
  });
  const data = await res.json();
  if (data.status === 'Ok') return data.data;
  throw new Error(data.message || 'Error al actualizar grupo de requisitos');
};

// Eliminar un RequirementGroup
export const deleteRequirementGroup = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.status === 'Ok') return true;
  throw new Error(data.message || 'Error al eliminar grupo de requisitos');
};
