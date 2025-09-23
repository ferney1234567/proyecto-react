const API_URL = "http://localhost:4000/api/v1/favorites";

// === Obtener todos ===
export const getFavoritos = async () => {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || "Error al obtener favoritos");
    return data;
  } catch (error) {
    console.error("❌ Error en getFavoritos:", error);
    throw error;
  }
};

// === Crear favorito ===
export const createFavorito = async (favorito) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(favorito),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear favorito: ${errorText}`);
  }

  return res.json();
};

// === Eliminar favorito ===
export const deleteFavorito = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar favorito");
  return res.json();
};
