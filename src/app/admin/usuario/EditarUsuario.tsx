'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaUserCheck, FaSave } from 'react-icons/fa';

interface Usuario {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

interface EditarUsuarioProps {
  usuario: Usuario;
  onClose: () => void;
  actualizarUsuario: (usuario: Usuario) => void;
  modoOscuro?: boolean;
}

export default function EditarUsuario({
  usuario,
  onClose,
  actualizarUsuario,
  modoOscuro = false,
}: EditarUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>(usuario);

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setFormData((prev) => ({ ...prev, is_active: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarUsuario(formData);
    onClose();
  };

  // Estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-200';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar Usuario</h2>
          <button
            className="text-white hover:text-red-200 p-2 rounded-full hover:bg-red-500/20 border border-white/20"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            {/* Nombre */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor}`}>Nombre</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-3 text-[#39A900]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={manejarCambio}
                  required
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor}`}>Correo</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3 text-[#39A900]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={manejarCambio}
                  required
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor}`}>Teléfono</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-3 text-[#39A900]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={manejarCambio}
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className={`block text-sm font-semibold ${labelColor}`}>Estado</label>
              <div className="relative">
                <FaUserCheck className="absolute left-4 top-3 text-[#39A900]" />
                <select
                  name="is_active"
                  value={formData.is_active ? "true" : "false"}
                  onChange={manejarCambio}
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 ${inputBg}`}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
            <button
              type="button"
              className={`flex items-center gap-3 px-6 py-3 rounded-xl ${cancelBtn}`}
              onClick={onClose}
            >
              <FaTimes size={16} /> Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-3 px-6 py-3 bg-[#39A900] text-white rounded-xl font-bold hover:scale-105 transition"
            >
              <FaSave size={16} /> Actualizar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
