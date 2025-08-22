'use client';
import { FaTimes, FaSave, FaClipboardCheck } from 'react-icons/fa';

interface ModalTipoProps {
  abierto: boolean;
  editando: boolean;
  valor: string;
  onCerrar: () => void;
  onGuardar: () => void;
  onCambio: (valor: string) => void;
}

export default function ModalTipo({
  abierto,
  editando,
  valor,
  onCerrar,
  onGuardar,
  onCambio,
}: ModalTipoProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editando ? 'Editar Tipo' : 'Crear Nuevo Tipo'}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
            onClick={onCerrar}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="nombreTipo" className="block text-sm font-medium text-gray-700">
              Nombre del Tipo
            </label>
            <div className="relative">
              <FaClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                id="nombreTipo"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md text-gray-800"
                placeholder="Ej: Tipo Académico"
                value={valor}
                onChange={(e) => onCambio(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors hover:shadow-md"
            onClick={onCerrar}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
            onClick={onGuardar}
          >
            <FaSave size={18} />
            <span>{editando ? 'Actualizar' : 'Guardar Tipo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
