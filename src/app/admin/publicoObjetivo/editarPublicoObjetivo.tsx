'use client';
import { useState, useEffect } from 'react';
import { FaUsers, FaSave, FaTimes, FaUserTag } from 'react-icons/fa';

interface EditarPublicoModalProps {
  mostrar: boolean;
  cerrar: () => void;
  nombre: string;
  setNombre: (nombre: string) => void;
  onGuardar: () => void;
  modoOscuro: boolean;
}

export default function EditarPublicoModal({
  mostrar,
  cerrar,
  nombre,
  setNombre,
  onGuardar,
  modoOscuro
}: EditarPublicoModalProps) {
  const [animacion, setAnimacion] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mostrar) {
      setVisible(true);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [mostrar]);

  if (!visible) return null;

  const handleGuardar = () => {
    onGuardar();
  };

  // 🔹 estilos dinámicos
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
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animacion ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header con gradiente e icono */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaUsers className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Editar Público Objetivo</h2>
          </div>
          <button
            onClick={cerrar}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre del público objetivo
            </label>
            <div className="relative">
              <FaUserTag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]"
                size={18}
              />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md ${inputBg}`}
                placeholder="Ej: Estudiantes universitarios, Profesionales, etc."
              />
            </div>
          </div>
        </div>

        {/* Footer estilizado */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={cerrar}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleGuardar}
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