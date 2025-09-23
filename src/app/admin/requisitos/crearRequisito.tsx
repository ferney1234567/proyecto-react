"use client";
import { useEffect, useState } from "react";
import {
  FaSave,
  FaTimes,
  FaClipboardCheck,
  FaBuilding,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";

// APIs
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getRequirementGroups } from "../../api/tipoRequisitos/routes";

interface ModalRequisitoProps {
  requisito: any;
  setRequisito: (value: any) => void;
  onClose: () => void;
  onSave: () => void;
  modoOscuro: boolean;
}

export default function ModalRequisito({
  requisito,
  setRequisito,
  onClose,
  onSave,
  modoOscuro,
}: ModalRequisitoProps) {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);

  // 🔹 Cargar catálogos desde la API
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [instRes, groupRes] = await Promise.all([
          getInstituciones(),
          getRequirementGroups(),
        ]);

        // API puede devolver {data: []} o [] → lo normalizamos
        setInstituciones(instRes?.data || instRes || []);
        setGrupos(groupRes?.data || groupRes || []);
      } catch (err) {
        console.error("❌ Error cargando instituciones o grupos:", err);
      }
    };
    fetchCatalogos();
  }, []);

  // 🔹 Estilos condicionales
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {requisito.id ? "Editar Requisito" : "Agregar Requisito"}
            </h2>
          </div>
          <button
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Nombre</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg ${inputBg}`}
                placeholder="Ingrese un requisito"
                value={requisito.nombre}
                onChange={(e) => setRequisito({ ...requisito, nombre: e.target.value })}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Observaciones</label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <input
                type="text"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg ${inputBg}`}
                placeholder="Ingrese una observación"
                value={requisito.observacion}
                onChange={(e) => setRequisito({ ...requisito, observacion: e.target.value })}
              />
            </div>
          </div>

          {/* Entidad */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Entidad</label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <select
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg ${inputBg}`}
                value={requisito.entidad}
                onChange={(e) => setRequisito({ ...requisito, entidad: e.target.value })}
              >
                <option value="">Seleccione una Entidad</option>
                {instituciones.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>

          {/* Grupo */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Grupo / Tipo</label>
            <div className="relative">
              <FaClipboardCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" size={18} />
              <select
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] text-lg ${inputBg}`}
                value={requisito.tipo}
                onChange={(e) => setRequisito({ ...requisito, tipo: e.target.value })}
              >
                <option value="">Seleccione un Grupo</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl ${cancelBtn}`}
            onClick={onClose}
          >
            <FaTimes size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500]"
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
