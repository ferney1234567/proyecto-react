const API_URL = "http://localhost:4000/api/v1/requirementChecks";

// 🔹 Obtener todos los chequeos
export const getRequirementChecks = async () => {
  const res = await fetch(API_URL, { cache: "no-store" });
  const data = await res.json();

  if (data.status === "Ok") {
    return data.data.map((c) => ({
      id: c.id,
      // 👇 Mapeamos isChecked (backend) a is_checked (frontend)
      is_checked: c.isChecked ? 1 : 0,
      empresa: c.company?.name || "Sin empresa",
      requisito: c.requirement?.name || "Sin requisito",
      companyId: c.companyId,
      requirementId: c.requirementId,
    }));
  }
  throw new Error(data.message || "Error al cargar requirementChecks");
};

// 🔹 Crear un chequeo
export const createRequirementCheck = async (is_checked, companyId, requirementId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 👇 Mandamos la propiedad como isChecked al backend
    body: JSON.stringify({
      isChecked: !!is_checked,
      companyId,
      requirementId,
    }),
  });
  const data = await res.json();
  if (data.status === "Ok") return data.data;
  throw new Error(data.message || "Error al crear requirementCheck");
};

// 🔹 Actualizar un chequeo
export const updateRequirementCheck = async (id, is_checked, companyId, requirementId) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // 👇 Mandamos la propiedad como isChecked al backend
    body: JSON.stringify({
      isChecked: !!is_checked,
      companyId,
      requirementId,
    }),
  });
  const data = await res.json();
  if (data.status === "Ok") return data.data;
  throw new Error(data.message || "Error al actualizar requirementCheck");
};

// 🔹 Eliminar un chequeo
export const deleteRequirementCheck = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (data.status === "Ok") return true;
  throw new Error(data.message || "Error al eliminar requirementCheck");
};
