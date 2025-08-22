'use client';
import { FaTimes, FaPenAlt, FaBookOpen, FaAlignLeft, FaSave } from 'react-icons/fa';

interface ModalInteresProps {
  mostrar: boolean;
  modoEdicion: boolean;
  interes: { id: string; nombre: string; descripcion: string };
  onClose: () => void;
  onChange: (campo: 'nombre' | 'descripcion', valor: string) => void;
  onGuardar: () => void;
}

export default function ModalInteres({
  mostrar,
  modoEdicion,
  interes,
  onClose,
  onChange,
  onGuardar
}: ModalInteresProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaPenAlt className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {modoEdicion ? 'Editar Interés' : 'Crear Nuevo Interés'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {/* Campo Nombre */}
          <div className="space-y-3">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div className="relative">
              <FaBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                id="nombre"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md text-gray-800"
                placeholder="Ingrese el nombre del interés"
                value={interes.nombre}
                onChange={(e) => onChange('nombre', e.target.value)}
              />
            </div>
          </div>

          {/* Campo Descripción */}
          <div className="space-y-3">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <div className="relative">
              <FaAlignLeft className="absolute left-3 top-4 text-[#39A900]" size={18} />
              <textarea
                id="descripcion"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md min-h-[120px] text-gray-800"
                placeholder="Ingrese una descripción"
                value={interes.descripcion}
                onChange={(e) => onChange('descripcion', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors hover:shadow-md"
            onClick={onClose}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onGuardar}
          >
            <FaSave size={18} />
            <span>{modoEdicion ? 'Actualizar' : 'Guardar Interés'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
