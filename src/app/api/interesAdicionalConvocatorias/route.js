// src/api/callAdditionalInterests/routes.js

const API_URL = "http://localhost:4000/api/v1/callAdditionalInterests";

export async function getCallAdditionalInterests() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("❌ Error al obtener CallAdditionalInterests");
  return res.json();
}

export async function createCallAdditionalInterest(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("❌ Error al crear CallAdditionalInterest");
  return res.json();
}

export async function updateCallAdditionalInterest(callId, interestId, body) {
  const res = await fetch(`${API_URL}/${callId}/${interestId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("❌ Error al actualizar CallAdditionalInterest");
  return res.json();
}

export async function deleteCallAdditionalInterest(callId, interestId) {
  const res = await fetch(`${API_URL}/${callId}/${interestId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("❌ Error al eliminar CallAdditionalInterest");
  return res.json();
}
