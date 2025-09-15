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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 ${modalBg} ${
          animacion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Editar Categoría</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes />
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
              className="w-full border rounded-xl pl-10 pr-4 py-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">
            Cancelar
          </button>
          <button
            onClick={() => onSave(categoria.id, nombre)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            <FaSave className="inline mr-1" /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
