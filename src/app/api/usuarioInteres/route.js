// src/api/userInterests/routes.js

const API_URL = "http://localhost:4000/api/v1/userInterests";

export async function getUserInterests() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("❌ Error al obtener userInterests");
  return res.json();
}

export async function createUserInterest(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("❌ Error al crear userInterest");
  return res.json();
}

export async function updateUserInterest(userId, interestId, body) {
  const res = await fetch(`${API_URL}/${userId}/${interestId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("❌ Error al actualizar userInterest");
  return res.json();
}

export async function deleteUserInterest(userId, interestId) {
  const res = await fetch(`${API_URL}/${userId}/${interestId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("❌ Error al eliminar userInterest");
  return res.json();
}
