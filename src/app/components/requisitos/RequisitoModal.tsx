// components/ModalRequisito.tsx
'use client';
import { FaSave, FaTimes, FaClipboardCheck, FaBuilding, FaFileAlt } from 'react-icons/fa';

export default function ModalRequisito({ requisito, setRequisito, onClose, onSave }) {
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
              {requisito.id ? 'Editar Requisito' : 'Agregar Requisito'}
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
        <div className="p-8 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                placeholder="Ingrese un Requisito"
                value={requisito.nombre}
                onChange={(e) => setRequisito({ ...requisito, nombre: e.target.value })}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                placeholder="Ingrese una Observación"
                value={requisito.observacion}
                onChange={(e) => setRequisito({ ...requisito, observacion: e.target.value })}
              />
            </div>
          </div>

          {/* Entidad */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Entidad</label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <select
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                value={requisito.entidad}
                onChange={(e) => setRequisito({ ...requisito, entidad: e.target.value })}
              >
                <option value="">Seleccione una Entidad</option>
                <option value="SENA">SENA</option>
                <option value="ICETEX">ICETEX</option>
                <option value="Universidad">Universidad</option>
              </select>
            </div>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Requisito de Selección</label>
            <div className="relative">
              <FaClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <select
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md  text-gray-800"
                value={requisito.tipo}
                onChange={(e) => setRequisito({ ...requisito, tipo: e.target.value })}
              >
                <option value="">Seleccione un Requisito</option>
                <option value="General">General</option>
                <option value="Educativo">Educativo</option>
                <option value="Laboral">Laboral</option>
              </select>
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
            onClick={onSave}
          >
            <FaSave size={18} />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
