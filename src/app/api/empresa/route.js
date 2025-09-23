const API_URL = "http://localhost:4000/api/v1/companies";

// === Obtener todas las empresas ===
export const getEmpresas = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener empresas");
  return res.json();
};

// === Crear empresa ===
export const createEmpresa = async (empresa) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
};

// === Actualizar empresa ===
export const updateEmpresa = async (id, empresa) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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
};

// === Eliminar empresa ===
export const deleteEmpresa = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok || data.status !== "Ok") {
    throw new Error(data.message || "Error al eliminar empresa");
  }
  return true;
};
