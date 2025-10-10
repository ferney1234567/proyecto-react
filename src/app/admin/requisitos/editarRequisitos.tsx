"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaClipboardList,
  FaFileAlt,
  FaBuilding,
  FaTag,
  FaChevronDown,
} from "react-icons/fa";

interface ModalEditarRequisitoProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  requisito: {
    id: number;
    nombre: string;
    observacion: string;
    entidadId: number; // ahora guardamos el ID
    tipoId: number; // ahora guardamos el ID
  };
  setRequisito: (req: any) => void;
  modoOscuro: boolean;
}

interface Institucion {
  id: number;
  name: string;
}

interface Grupo {
  id: number;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function ModalEditarRequisito({
  visible,
  onClose,
  onSave,
  requisito,
  setRequisito,
  modoOscuro,
}: ModalEditarRequisitoProps) {
  const [animar, setAnimar] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // 🔹 Manejo de apertura y carga de datos
  useEffect(() => {
    if (visible) {
      setMostrar(true);
      setTimeout(() => setAnimar(true), 10);

      const fetchData = async () => {
        try {
          const [resInst, resGroup] = await Promise.all([
            fetch(`${API_URL}/institutions`),
            fetch(`${API_URL}/requirementGroups`),
          ]);

          const instData = await resInst.json();
          const groupData = await resGroup.json();

          setInstituciones(instData.data || instData || []);
          setGrupos(groupData.data || groupData || []);
        } catch (error) {
          console.error("❌ Error cargando instituciones o grupos:", error);
          setInstituciones([]);
          setGrupos([]);
        }
      };

      fetchData();
    } else {
      setAnimar(false);
      setTimeout(() => setMostrar(false), 300);
    }
  }, [visible]);

  if (!mostrar) return null;

  // 🎨 Estilos condicionales
  const modalBg = modoOscuro ? "bg-[#1a0526] text-white" : "bg-white text-gray-900";
  const inputBg = modoOscuro
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500";
  const labelColor = modoOscuro ? "text-gray-300" : "text-gray-700";
  const footerBg = modoOscuro ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const cancelBtn = modoOscuro
    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        animar ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ${
          animar ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2d8500] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaClipboardList /> Editar Requisito
          </h2>
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
            <label className={`block text-sm font-medium ${labelColor}`}>
              Nombre del requisito
            </label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <input
                type="text"
                value={requisito.nombre}
                onChange={(e) => setRequisito({ ...requisito, nombre: e.target.value })}
                placeholder="Ejemplo: Certificado de Seguridad Industrial"
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] ${inputBg}`}
              />
            </div>
          </div>

          {/* Observación */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>
              Observación
            </label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-3 text-[#39A900]" />
              <textarea
                value={requisito.observacion}
                onChange={(e) =>
                  setRequisito({ ...requisito, observacion: e.target.value })
                }
                rows={3}
                placeholder="Ejemplo: Documento obligatorio emitido por la entidad correspondiente."
                className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#39A900] ${inputBg}`}
              />
            </div>
          </div>

          {/* Seleccionar Institución */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Entidad *</label>
            <div className="relative">
              <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <select
                value={requisito.entidadId || ""}
                onChange={(e) => setRequisito({ ...requisito, entidadId: Number(e.target.value) })}
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
              >
                <option value="">Seleccione una entidad</option>
                {instituciones.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Seleccionar Grupo */}
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${labelColor}`}>Grupo *</label>
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#39A900]" />
              <select
                value={requisito.tipoId || ""}
                onChange={(e) => setRequisito({ ...requisito, tipoId: Number(e.target.value) })}
                className={`w-full border rounded-xl pl-10 pr-10 py-3 appearance-none focus:ring-2 focus:ring-[#39A900] focus:border-[#39A900] ${inputBg}`}
              >
                <option value="">Seleccione un grupo</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`${footerBg} px-8 py-6 flex justify-between items-center border-t`}>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-colors hover:shadow-md ${cancelBtn}`}
          >
            <FaTimes /> Cancelar
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-xl hover:bg-[#2d8500] transition-colors"
          >
            <FaSave /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
