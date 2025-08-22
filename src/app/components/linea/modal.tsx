'use client';
import { FaProjectDiagram, FaAlignLeft, FaTimes, FaSave } from 'react-icons/fa';

interface ModalProps {
  mostrar: boolean;
  cerrar: () => void;
  nombre: string;
  descripcion: string;
  setNombre: (value: string) => void;
  setDescripcion: (value: string) => void;
  onGuardar: () => void;
  editandoId: string | null;
}

export default function ModalLinea({
  mostrar,
  cerrar,
  nombre,
  descripcion,
  setNombre,
  setDescripcion,
  onGuardar,
  editandoId,
}: ModalProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaProjectDiagram className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editandoId ? 'Editar Línea' : 'Crear Nueva Línea'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={cerrar}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label htmlFor="nombreLinea" className="block text-sm font-medium text-gray-700">
              Nombre de la Línea
            </label>
            <div className="relative">
              <FaProjectDiagram className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                id="nombreLinea"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md text-gray-800"
                placeholder="Ej: Tecnología, Educación, etc."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <div className="relative">
              <FaAlignLeft className="absolute left-3 top-4 text-[#39A900]" size={18} />
              <textarea
                id="descripcion"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md text-gray-800"
                placeholder="Describa brevemente la línea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors hover:shadow-md"
            onClick={cerrar}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onGuardar}
          >
            <FaSave size={18} />
            <span>{editandoId ? 'Actualizar Línea' : 'Guardar Línea'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
