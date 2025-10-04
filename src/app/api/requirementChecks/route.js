const API_URL = "http://localhost:4000/api/v1/requirementChecks";

export const getRequirementChecks = async () => {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();
    if (data.status === "Ok") return data.data;
    return [];
  } catch {
    return [];
  }
};

export const createRequirementCheck = async (is_checked, companyId, requirementId, userId) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isChecked: !!is_checked, companyId, requirementId, userId }),
  });
  return await res.json();
};

export const updateRequirementCheck = async (id, is_checked, companyId, requirementId, userId) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isChecked: !!is_checked, companyId, requirementId, userId }),
  });
  return await res.json();
};

export const deleteRequirementCheck = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return await res.json();
};
