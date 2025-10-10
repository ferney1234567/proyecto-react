"use client";

import { useState, useEffect } from "react";
import {
  FaBullhorn, FaCalendarAlt, FaCalendarTimes, FaBuilding,
  FaRegFileAlt, FaCheckCircle, FaRegBookmark, FaSearch,
  FaInfoCircle, FaTimes
} from "react-icons/fa";

// 👇 Tema
import { useTheme } from "../../app/ThemeContext";
import { getThemeStyles } from "../../app/themeStyles";

export interface Convocatoria {
  id?: number;
  callId?: number;
  title: string;
  description: string;
  resources: string;
  callLink: string;
  openDate: string;
  closeDate: string;
  pageName: string;
  pageUrl: string;
  objective: string;
  notes: string;
  institutionId: number;
  lineId: number;
  targetAudienceId: number;
  interestId: number;
  userId: number;
  clickCount: number;
  imageUrl?: string;
}


interface Catalogo {
  id: number;
  name: string;
}


  const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function ModalConvocatoria({
  modalAbierto,
  cerrarModal,
  convocatoria,
}: {
  modalAbierto: boolean;
  cerrarModal: () => void;
  convocatoria: Convocatoria | null;
}) {
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");

  const { modoOscuro } = useTheme();
  const estilos = getThemeStyles(modoOscuro);

  const [instituciones, setInstituciones] = useState<Catalogo[]>([]);
  const [lineas, setLineas] = useState<Catalogo[]>([]);
  const [publicos, setPublicos] = useState<Catalogo[]>([]);
  const [intereses, setIntereses] = useState<Catalogo[]>([]);
  const [usuarios, setUsuarios] = useState<Catalogo[]>([]);

  // ✅ Función segura → devuelve "null" si no encuentra nada
  const getNombre = (arr: Catalogo[] | undefined, id: number | undefined) => {
    if (!arr || arr.length === 0 || !id) return "null";
    return arr.find(item => item.id === id)?.name || "null";
  };

  // ✅ Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cerrarModal]);

  // ✅ Cargar catálogos reales de la API
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [instRes, lineRes, publRes, intRes, userRes] = await Promise.all([
          fetch(`${API_URL}/institutions`).then(r => r.json()),
          fetch(`${API_URL}/lines`).then(r => r.json()),
          fetch(`${API_URL}/targetAudiences`).then(r => r.json()),
          fetch(`${API_URL}/interests`).then(r => r.json()),
          fetch(`${API_URL}/users`).then(r => r.json()),
        ]);

        setInstituciones(instRes.data || []);
        setLineas(lineRes.data || []);
        setPublicos(publRes.data || []);
        setIntereses(intRes.data || []);
        setUsuarios(userRes.data || []);
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };
    fetchCatalogos();
  }, []);

  if (!modalAbierto || !convocatoria) return null;

  return (
    <div
      onClick={cerrarModal}
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative ${estilos.card} rounded-2xl w-[95%] max-w-5xl max-h-[90vh] 
                    overflow-y-scroll scrollbar-hide shadow-2xl animate-fade-in`}
      >
        {/* ENCABEZADO */}
        <div
          className={`p-6 px-8 flex justify-between items-center rounded-t-2xl 
          ${modoOscuro
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-[#00324D] to-[#00668c]"}`}
        >
          <div className="flex-grow text-center">
            <h3 className="text-2xl font-semibold text-white flex justify-center items-center gap-3">
              <FaBullhorn className="text-yellow-300 text-2xl" />
              {convocatoria.title}
            </h3>
          </div>
          <button
            onClick={cerrarModal}
            className="absolute top-6 right-6 text-gray-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* IMAGEN */}
        <div className="flex justify-center items-center p-6">
          <img
            src={convocatoria.imageUrl || "/img/default.jpg"}
            alt={convocatoria.title}
            className={`w-full max-w-[1000px] max-h-[400px] object-cover rounded-xl shadow-md border 
            ${modoOscuro ? "border-white/10" : "border-gray-200"}`}
          />
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mx-8 mb-6">
          <div className={`${modoOscuro ? "bg-gray-800" : "bg-blue-50"} rounded-xl p-5 shadow-sm text-center transform transition-transform hover:scale-105`}>
            <FaCalendarAlt className="text-blue-500 text-3xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Fecha de Apertura</p>
            <strong>{new Date(convocatoria.openDate).toLocaleDateString()}</strong>
          </div>
          <div className={`${modoOscuro ? "bg-gray-800" : "bg-red-50"} rounded-xl p-5 shadow-sm text-center transform transition-transform hover:scale-105`}>
            <FaCalendarTimes className="text-red-500 text-3xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Fecha de Cierre</p>
            <strong>{new Date(convocatoria.closeDate).toLocaleDateString()}</strong>
          </div>
          <div className={`${modoOscuro ? "bg-gray-800" : "bg-purple-50"} rounded-xl p-5 shadow-sm text-center transform transition-transform hover:scale-105`}>
            <FaBuilding className="text-purple-600 text-3xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Entidad</p>
            <strong>{getNombre(instituciones, convocatoria.institutionId)}</strong>
          </div>
        </div>

        {/* PESTAÑAS */}
       <div className="flex flex-wrap justify-center gap-1 mx-8 pb-2">

          {[
            { id: "descripcion", icon: FaRegFileAlt, label: "Descripción", color: "text-blue-500" },
            { id: "objetivos", icon: FaCheckCircle, label: "Objetivos", color: "text-green-500" },
            { id: "recursos", icon: FaRegBookmark, label: "Recursos", color: "text-yellow-500" },
            { id: "observaciones", icon: FaSearch, label: "Observaciones", color: "text-orange-500" },
            { id: "masInformacion", icon: FaInfoCircle, label: "Más información", color: "text-purple-500" },
          ].map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setPestanaActiva(id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm rounded-lg font-medium transition-all duration-200 ${pestanaActiva === id
                  ? `${modoOscuro ? "bg-gray-700 shadow text-white" : "bg-white shadow-sm"} ${color}`
                  : `${modoOscuro ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* CONTENIDO MEJORADO */}
        <div
          className={`p-6 mx-8 rounded-xl min-h-[150px] mb-6 shadow-md border transition-colors duration-300 
          ${modoOscuro ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}
        >
          {pestanaActiva === "descripcion" && (
            <div>
              <h4 className={`text-lg font-semibold mb-3 ${modoOscuro ? "text-white" : "text-gray-900"}`}>Descripción</h4>
              <p className="leading-relaxed">{convocatoria.description}</p>
            </div>
          )}
          {pestanaActiva === "objetivos" && (
            <div>
              <h4 className={`text-lg font-semibold mb-3 ${modoOscuro ? "text-white" : "text-gray-900"}`}>Objetivos</h4>
              <p className="leading-relaxed">{convocatoria.objective}</p>
            </div>
          )}
          {pestanaActiva === "recursos" && (
            <div>
              <h4 className={`text-lg font-semibold mb-3 ${modoOscuro ? "text-white" : "text-gray-900"}`}>Recursos</h4>
              <p className="leading-relaxed">{convocatoria.resources}</p>
            </div>
          )}
          {pestanaActiva === "observaciones" && (
            <div>
              <h4 className={`text-lg font-semibold mb-3 ${modoOscuro ? "text-white" : "text-gray-900"}`}>Observaciones</h4>
              <p className="leading-relaxed">{convocatoria.notes}</p>
            </div>
          )}
          {pestanaActiva === "masInformacion" && (
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${modoOscuro ? "text-white" : "text-gray-900"}`}>Más Información</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className={`p-3 rounded-lg shadow-sm ${modoOscuro ? "bg-gray-800" : "bg-gray-50"}`}>
                  <strong>Público Objetivo:</strong> {getNombre(publicos, convocatoria.targetAudienceId)}
                </div>
                <div className={`p-3 rounded-lg shadow-sm ${modoOscuro ? "bg-gray-800" : "bg-gray-50"}`}>
                  <strong>Área de Interés:</strong> {getNombre(intereses, convocatoria.interestId)}
                </div>
                <div className={`p-3 rounded-lg shadow-sm ${modoOscuro ? "bg-gray-800" : "bg-gray-50"}`}>
                  <strong>Línea Estratégica:</strong> {getNombre(lineas, convocatoria.lineId)}
                </div>
                <div className={`p-3 rounded-lg shadow-sm ${modoOscuro ? "bg-gray-800" : "bg-gray-50"}`}>
                  <strong>Usuario Responsable:</strong> {getNombre(usuarios, convocatoria.userId)}
                </div>
                <div className={`p-3 rounded-lg shadow-sm ${modoOscuro ? "bg-gray-800" : "bg-gray-50"}`}>
                  <strong>Clicks registrados:</strong> {convocatoria.clickCount}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTONES FINALES */}
        <div className="flex justify-end gap-4 px-8 pb-6">
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
          >
            <FaCheckCircle /> Inscribirse
          </button>
          <button
            onClick={cerrarModal}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow transition"
          >
            <FaTimes /> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
