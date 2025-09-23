'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaTag } from 'react-icons/fa';

interface EditarCategoriaModalProps {
  visible: boolean;
  onClose: () => void;
  categoria: { id: string; name: string };
  onSave: (id: string, nombre: string) => void;
  modoOscuro: boolean;
}

export default function EditarCategoriaModal({
  visible,
  onClose,
  categoria,
  onSave,
  modoOscuro,
}: EditarCategoriaModalProps) {
  const [nombre, setNombre] = useState(categoria.name);
  const [animacion, setAnimacion] = useState(false);

  useEffect(() => {
    if (visible) {
      setNombre(categoria.name);
      setTimeout(() => setAnimacion(true), 10);
    } else {
      setAnimacion(false);
    }
  }, [visible, categoria]);

  if (!visible) return null;

  const modalBg = modoOscuro ? 'bg-[#1a0526] text-white' : 'bg-white text-gray-900';
  const inputBg = modoOscuro
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 ${modalBg} ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header (verde con icono) */}
        <div className="bg-[#39A900] p-5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTag /> Editar Categoría
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
            />
          </div>
        </div>

        {/* Footer con íconos */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            <FaTimes size={16} /> Cancelar
          </button>
          <button
            onClick={() => onSave(categoria.id, nombre)}
            className="flex items-center gap-2 px-5 py-2 bg-[#39A900] text-white rounded-xl font-semibold text-lg hover:bg-[#2d8500] transition transform hover:scale-105"
          >
            <FaSave size={16} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
