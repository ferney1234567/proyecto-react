// src/api/empresas/routes.js

// ✅ Cargar URL base desde la variable de entorno (.env)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/companies`;

// ======================================================
// 🧠 Helper global para peticiones con JWT automáticamente
// ======================================================
const fetchConToken = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // 🔒 Adjunta JWT si existe
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
};

// ============================
// 📍 CRUD de Empresas
// ============================

// === Obtener todas las empresas (pública o autenticada)
export const getEmpresas = async () => {
  try {
    const res = await fetchConToken(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener empresas");
    return res.json();
  } catch (err) {
    console.error("❌ Error en getEmpresas:", err);
    throw err;
  }
};

// === Crear empresa (requiere token)
export const createEmpresa = async (empresa) => {
  try {
    const res = await fetchConToken(API_URL, {
      method: "POST",
      body: JSON.stringify({
        // 🔹 Mapeamos las claves al formato esperado por el backend
        name: empresa.nombre,
        taxId: empresa.nit,
        legalName: empresa.razonSocial,
        address: empresa.direccion,
        phone: empresa.telefono,
        website: empresa.paginaWeb,
        employeeCount: Number(empresa.empleados) || 0,
        economicSector: empresa.sector,
        description: empresa.descripcion,
        existenceYears: empresa.tiempo ? Number(empresa.tiempo) : 0,
        legalDocument: empresa.documentoLegal,
        legalFirstName: empresa.nombreLegal,
        legalLastName: empresa.apellidoLegal,
        legalRepresentativeName: `${empresa.nombreLegal || ""} ${empresa.apellidoLegal || ""}`.trim(),
        legalRepresentativeRole: empresa.cargoLegal,
        legalRepresentativePhone: empresa.celular,
        legalRepresentativeEmail: empresa.email,
        landline: empresa.telefonoFijo,
        legalMobile: empresa.celular,
        email: empresa.email,
        legalPosition: empresa.cargoLegal,
        cityId: empresa.cityId ? Number(empresa.cityId) : null, // 👈 ID real
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "Ok") {
      throw new Error(data.message || "Error al crear empresa");
    }
    return data;
  } catch (err) {
    console.error("❌ Error en createEmpresa:", err);
    throw err;
  }
};

// === Actualizar empresa (requiere token)
export const updateEmpresa = async (id, empresa) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: empresa.nombre,
        taxId: empresa.nit,
        legalName: empresa.razonSocial,
        address: empresa.direccion,
        phone: empresa.telefono,
        website: empresa.paginaWeb,
        employeeCount: Number(empresa.empleados) || 0,
        economicSector: empresa.sector,
        description: empresa.descripcion,
        existenceYears: empresa.tiempo ? Number(empresa.tiempo) : 0,
        legalDocument: empresa.documentoLegal,
        legalFirstName: empresa.nombreLegal,
        legalLastName: empresa.apellidoLegal,
        legalRepresentativeName: `${empresa.nombreLegal || ""} ${empresa.apellidoLegal || ""}`.trim(),
        legalRepresentativeRole: empresa.cargoLegal,
        legalRepresentativePhone: empresa.celular,
        legalRepresentativeEmail: empresa.email,
        landline: empresa.telefonoFijo,
        legalMobile: empresa.celular,
        email: empresa.email,
        legalPosition: empresa.cargoLegal,
        cityId: empresa.cityId ? Number(empresa.cityId) : null,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "Ok") {
      throw new Error(data.message || "Error al actualizar empresa");
    }
    return data;
  } catch (err) {
    console.error("❌ Error en updateEmpresa:", err);
    throw err;
  }
};

// === Eliminar empresa (requiere token)
export const deleteEmpresa = async (id) => {
  try {
    const res = await fetchConToken(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || data.status !== "Ok") {
      throw new Error(data.message || "Error al eliminar empresa");
    }
    return true;
  } catch (err) {
    console.error("❌ Error en deleteEmpresa:", err);
    throw err;
  }
};
