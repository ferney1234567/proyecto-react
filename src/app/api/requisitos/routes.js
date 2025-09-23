const API_URL = "http://localhost:4000/api/v1/requirements";

export const getRequisitos = async () => {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });

    // ✅ devolvemos [] si no hay registros
    if (res.status === 204 || res.status === 404) return [];

    if (!res.ok) throw new Error(`Error al cargar requisitos: ${res.status}`);

    const data = await res.json();

    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("❌ getRequisitos error:", error);
    return []; // nunca rompemos el front
  }
};

export const createRequisito = async (requisito) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requisito),
  });
  if (!res.ok) throw new Error("Error al crear requisito");
  return res.json();
};

export const updateRequisito = async (id, requisito) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requisito),
  });
  if (!res.ok) throw new Error("Error al actualizar requisito");
  return res.json();
};

export const deleteRequisito = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar requisito");
  return res.json();
};
