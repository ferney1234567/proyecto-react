'use client';
import { useState, useEffect } from 'react';
import { FaBuilding, FaSave, FaTimes } from 'react-icons/fa';

interface EntidadModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  nuevaEntidad: string;
  setNuevaEntidad: (value: string) => void;
  modoOscuro: boolean;
}

export default function EntidadModal({
  visible,
  onClose,
  onSave,
  nuevaEntidad,
  setNuevaEntidad,
  modoOscuro
}: EntidadModalProps) {
  const [animacion, setAnimacion] = useState(false);
  const [renderizar, setRenderizar] = useState(false);

  useEffect(() => {
    if (visible) {
      setRenderizar(true);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
      setTimeout(() => setRenderizar(false), 300);
    }
  }, [visible]);

  if (!renderizar) return null;

  // 🔹 Estilos dinámicos
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
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animacion ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`rounded-2xl w-full max-w-lg overflow-hidden transform transition-all duration-300 shadow-2xl ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${modalBg}`}
      >
        {/* Header con gradiente e ícono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaBuilding className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white">Editar Entidad</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre de la entidad
            </label>
            <div className="relative">
              <FaBuilding
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                value={nuevaEntidad}
                onChange={(e) => setNuevaEntidad(e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Ej: Universidad Nacional, Hospital Central..."
              />
            </div>
          </div>
        </div>

        {/* Footer estilizado */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onSave}
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
