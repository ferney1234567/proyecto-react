'use client';

import { useEffect, useState } from 'react';
import { X, Save, Building2 } from 'lucide-react';

interface CiudadModalProps {
  mostrar: boolean;
  onClose: () => void;
  onSave: () => void;
  editandoId: string | null;
  nombreCiudad: string;
  setNombreCiudad: (value: string) => void;
  nombreDepartamento: string;
  setNombreDepartamento: (value: string) => void;
  modoOscuro: boolean;
}

export default function CiudadModal({
  mostrar,
  onClose,
  onSave,
  editandoId,
  nombreCiudad,
  setNombreCiudad,
  nombreDepartamento,
  setNombreDepartamento,
  modoOscuro,
}: CiudadModalProps) {
  const [animar, setAnimar] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mostrar) {
      setVisible(true);
      setTimeout(() => setAnimar(true), 10);
    } else {
      setAnimar(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [mostrar]);

  if (!visible) return null;

  // 🎨 Estilos condicionales
  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';
  const labelColor = modoOscuro ? 'text-gray-300' : 'text-gray-700';
  const footerBg = modoOscuro ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cancelBtn = modoOscuro
    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'border-gray-300 text-gray-700 hover:bg-gray-100';

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animar ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 ${
          animar ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 size={24} />
            {editandoId ? 'Editar Ciudad' : 'Agregar Ciudad'}
          </h2>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Nombre Ciudad */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre de la Ciudad *
            </label>
            <input
              type="text"
              value={nombreCiudad}
              onChange={(e) => setNombreCiudad(e.target.value)}
              placeholder="Ejemplo: Medellín"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
            />
          </div>

          {/* Nombre Departamento */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre del Departamento *
            </label>
            <input
              type="text"
              value={nombreDepartamento}
              onChange={(e) => setNombreDepartamento(e.target.value)}
              placeholder="Ejemplo: Antioquia"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            <Save size={18} />
            <span>{editandoId ? 'Actualizar' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
