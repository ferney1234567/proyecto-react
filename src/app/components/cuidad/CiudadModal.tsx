'use client';
import { FaCity, FaTimes, FaMapMarkerAlt, FaMapMarked, FaSave } from 'react-icons/fa';

interface CiudadModalProps {
  mostrar: boolean;
  onClose: () => void;
  onSave: () => void;
  editandoId: string | null;
  nombreCiudad: string;
  setNombreCiudad: (value: string) => void;
  nombreDepartamento: string;
  setNombreDepartamento: (value: string) => void;
}

export default function CiudadModal({
  mostrar,
  onClose,
  onSave,
  editandoId,
  nombreCiudad,
  setNombreCiudad,
  nombreDepartamento,
  setNombreDepartamento
}: CiudadModalProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaCity className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editandoId ? 'Editar Ciudad' : 'Crear Nueva Ciudad'}
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
          {/* Ciudad */}
          <div className="space-y-2">
            <label htmlFor="nombreCiudad" className="block text-sm font-medium text-gray-700">
              Ciudad
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                id="nombreCiudad"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md text-gray-800"
                placeholder="Ingrese una ciudad"
                value={nombreCiudad}
                onChange={(e) => setNombreCiudad(e.target.value)}
              />
            </div>
          </div>

          {/* Departamento */}
          <div className="space-y-2">
            <label htmlFor="nombreDepartamento" className="block text-sm font-medium text-gray-700">
              Departamento
            </label>
            <div className="relative">
              <FaMapMarked className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <select
                id="nombreDepartamento"
                className="w-full border border-gray-300 rounded-xl pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg transition-all hover:shadow-md appearance-none text-gray-800"
                value={nombreDepartamento}
                onChange={(e) => setNombreDepartamento(e.target.value)}
              >
                <option value="">Seleccione un departamento</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Atlántico">Atlántico</option>
                <option value="Bogotá D.C.">Bogotá D.C.</option>
                <option value="Bolívar">Bolívar</option>
                <option value="Boyacá">Boyacá</option>
                <option value="Caldas">Caldas</option>
                <option value="Caquetá">Caquetá</option>
                <option value="Cauca">Cauca</option>
                <option value="Nariño">Nariño</option>
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
            <span>{editandoId ? 'Actualizar' : 'Guardar Ciudad'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
