// services/departamentoService.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/departments`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Agrega el token JWT si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Departamentos
// ============================

// Obtener todos los departamentos (pública o autenticada)
export const fetchDepartamentos = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener departamentos");
    const json = await res.json();
    return json.data || []; // 👈 siempre devuelve array de departamentos
  } catch (err) {
    console.error("❌ Error en fetchDepartamentos:", err);
    throw err;
  }
};

// Crear un nuevo departamento (requiere token)
export const crearDepartamento = async (data) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear departamento");
    const json = await res.json();
    return json.data; // 👈 devuelve solo el nuevo depto
  } catch (err) {
    console.error("❌ Error en crearDepartamento:", err);
    throw err;
  }
};

// Editar un departamento (requiere token)
export const editarDepartamento = async (id, data) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al editar departamento");
    const json = await res.json();
    return json.data; // 👈 devuelve el depto actualizado
  } catch (err) {
    console.error("❌ Error en editarDepartamento:", err);
    throw err;
  }
};

// Eliminar un departamento (requiere token)
export const eliminarDepartamento = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar departamento");
    const json = await res.json();
    return json.data; // 👈 devuelve el objeto eliminado (si tu API lo envía)
  } catch (err) {
    console.error("❌ Error en eliminarDepartamento:", err);
    throw err;
  }
};
