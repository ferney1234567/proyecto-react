// src/api/userInterests/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/userInterests`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
// ✅ Exporta la función para poder usarla fuera
export const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    console.error("⚠️ Error en fetch:", res.status, res.statusText, "→", url);
    const body = await res.text();
    console.error("⚠️ Respuesta del servidor:", body);
  }

  return res;
};



// ============================
// 📍 CRUD de UserInterests
// ============================

// ✅ Obtener todos los userInterests (opcionalmente autenticado)
export async function getUserInterests() {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("❌ Error al obtener userInterests");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getUserInterests:", err);
    throw err;
  }
}

// ✅ Obtener intereses de un usuario específico
export async function getUserInterestsByUserId(userId) {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`❌ Error al obtener intereses`);
    const json = await res.json();

    // 🔹 Estructura esperada: { data: [{ userId, interest: { id, name } }] }
    const lista = json.data ?? json;

    // 🔹 Filtrar por el usuario actual
    const soloMios = lista.filter((item) => {
      const uid = item.userId ?? item.user_id ?? item.user?.id;
      return Number(uid) === Number(userId);
    });

    // 🔹 Extraer solo los intereses asociados
    const intereses = soloMios.map((i) => ({
      id: i.interest?.id ?? i.id ?? 0,
      name: i.interest?.name ?? i.name ?? "Sin nombre",
    }));

    return intereses;
  } catch (err) {
    console.error("❌ Error en getUserInterestsByUserId:", err);
    return [];
  }
}

// ✅ Crear relación user–interest (requiere token)
export async function createUserInterest(body) {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("❌ Error al crear userInterest");
    return res.json();
  } catch (err) {
    console.error("❌ Error en createUserInterest:", err);
    throw err;
  }
}

// ✅ Actualizar relación user–interest (requiere token)
export async function updateUserInterest(userId, interestId, body) {
  try {
    const res = await fetchConToken(`${API_URL}/${userId}/${interestId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("❌ Error al actualizar userInterest");
    return res.json();
  } catch (err) {
    console.error("❌ Error en updateUserInterest:", err);
    throw err;
  }
}

// ✅ Eliminar relación user–interest (requiere token)
export async function deleteUserInterest(userId, interestId) {
  try {
    const res = await fetchConToken(`${API_URL}/${userId}/${interestId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("❌ Error al eliminar userInterest");
    return res.json();
  } catch (err) {
    console.error("❌ Error en deleteUserInterest:", err);
    throw err;
  }
}
