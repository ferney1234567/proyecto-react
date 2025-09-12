// ModalEditarRol.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaUserShield, FaUserTag, FaTimes, FaSave } from 'react-icons/fa';

interface ModalEditarRolProps {
  rol: { id: string; name: string } | null;
  onClose: () => void;
  onSave: (id: string, newName: string) => void;
  modoOscuro: boolean;
}

export default function ModalEditarRol({ rol, onClose, onSave, modoOscuro }: ModalEditarRolProps) {
  const [nombreRol, setNombreRol] = useState('');

  useEffect(() => {
    if (rol) setNombreRol(rol.name);
  }, [rol]);

  if (!rol) return null;

  // 🎨 estilos dinámicos
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}
      >
        {/* 🔹 Header con gradiente e ícono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaUserShield className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Rol</h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* 🔹 Body con input e ícono */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="nombreRol" className={`block text-sm font-medium ${labelColor}`}>
              Nombre del Rol
            </label>
            <div className="relative">
              <FaUserTag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                id="nombreRol"
                value={nombreRol}
                onChange={(e) => setNombreRol(e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Ej: Administrador, Editor, etc."
              />
            </div>
          </div>
        </div>

        {/* 🔹 Footer con botones e íconos */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-all hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={() => onSave(rol.id, nombreRol)}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <FaSave size={18} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
