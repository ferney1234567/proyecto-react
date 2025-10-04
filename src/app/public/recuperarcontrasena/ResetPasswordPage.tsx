"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");   // o código enviado al correo
  const [password, setPassword] = useState("");
const manejarReset = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4000/api/v1/auths/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }), // 👈 CAMBIO AQUÍ
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Contraseña restablecida correctamente. Ya puedes iniciar sesión.");
      setToken("");
      setPassword("");
    } else {
      alert("⚠️ " + (data.message || "No se pudo restablecer la contraseña."));
    }
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    alert("Error de conexión con el servidor.");
  }
};


  return (
    <form onSubmit={manejarReset}>
      <input
        type="text"
        placeholder="Código recibido en el correo"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Restablecer</button>
    </form>
  );
}
