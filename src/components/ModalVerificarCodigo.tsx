"use client";

import { useState } from "react";
import Swal from "sweetalert2";

interface ModalVerificarProps {
  abierto: boolean;
  onCerrar: () => void;
  email: string;
}

export default function ModalVerificarCodigo({ abierto, onCerrar, email }: ModalVerificarProps) {
  const [codigo, setCodigo] = useState("");

  const verificarCodigo = async () => {
    if (codigo.length !== 6) {
      Swal.fire("⚠️ Atención", "El código debe tener 6 dígitos", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/v1/auths/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codigo }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("✅ Código válido", "Ahora puedes restablecer tu contraseña", "success");
        onCerrar(); // cerrar modal
        // Aquí podrías redirigir al formulario de reset
      } else {
        Swal.fire("❌ Error", data.message || "El código no es válido o expiró", "error");
      }
    } catch (error) {
      Swal.fire("❌ Error", "No se pudo verificar el código", "error");
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verificar Código
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Ingresa el código de <strong>6 dígitos</strong> enviado a tu correo <br />
          <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="••••••"
          className="w-full text-center text-2xl tracking-widest py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-6"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCerrar}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={verificarCodigo}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition font-semibold"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}
