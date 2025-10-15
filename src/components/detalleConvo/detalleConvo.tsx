"use client";

import { useState, useEffect, JSX } from "react";
import {
  FaBullhorn, FaCalendarAlt, FaCalendarTimes,
  FaRegFileAlt, FaCheckCircle, FaRegBookmark, FaSearch,
  FaInfoCircle, FaTimes, FaExternalLinkAlt, FaLink,
  FaGlobeAmericas, FaProjectDiagram, FaUniversity
} from "react-icons/fa";
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

  const getNombre = (arr: Catalogo[] | undefined, id: number | undefined) => {
    if (!arr || arr.length === 0 || !id) return "—";
    return arr.find(item => item.id === id)?.name || "—";
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && cerrarModal();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cerrarModal]);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [instRes, lineRes, publRes, intRes] = await Promise.all([
          fetch(`${API_URL}/institutions`).then(r => r.json()),
          fetch(`${API_URL}/lines`).then(r => r.json()),
          fetch(`${API_URL}/targetAudiences`).then(r => r.json()),
          fetch(`${API_URL}/interests`).then(r => r.json()),
        ]);
        setInstituciones(instRes.data || []);
        setLineas(lineRes.data || []);
        setPublicos(publRes.data || []);
        setIntereses(intRes.data || []);
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
        className={`relative ${estilos.card} rounded-2xl w-[95%] max-w-5xl max-h-[90vh] overflow-y-scroll scrollbar-hide shadow-2xl animate-fade-in`}
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
            className={`w-full max-w-[950px] max-h-[320px] object-cover rounded-xl shadow-md border 
            ${modoOscuro ? "border-white/10" : "border-gray-200"}`}
          />
        </div>

        {/* CONTENEDORES PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mx-8 mb-6">
          <CardInfo
            icon={<FaCalendarAlt className="text-blue-500 text-4xl mb-2 mx-auto" />}
            title="Fecha de Apertura"
            value={new Date(convocatoria.openDate).toLocaleDateString()}
            bg={modoOscuro ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-200"}
          />
          <CardInfo
            icon={<FaCalendarTimes className="text-red-500 text-4xl mb-2 mx-auto" />}
            title="Fecha de Cierre"
            value={new Date(convocatoria.closeDate).toLocaleDateString()}
            bg={modoOscuro ? "bg-gray-800 border border-gray-700" : "bg-red-50 border border-red-200"}
          />
          <CardInfo
            icon={<FaGlobeAmericas className="text-teal-500 text-4xl mb-2 mx-auto" />}
            title="Área de Interés"
            value={getNombre(intereses, convocatoria.interestId)}
            bg={modoOscuro ? "bg-gray-800 border border-gray-700" : "bg-teal-50 border border-teal-200"}
          />
          <CardInfo
            icon={<FaUniversity className="text-indigo-500 text-4xl mb-2 mx-auto" />}
            title="Institución"
            value={getNombre(instituciones, convocatoria.institutionId)}
            bg={modoOscuro ? "bg-gray-800 border border-gray-700" : "bg-indigo-50 border border-indigo-200"}
          />
          <CardInfo
            icon={<FaProjectDiagram className="text-emerald-500 text-4xl mb-2 mx-auto" />}
            title="Línea"
            value={getNombre(lineas, convocatoria.lineId)}
            bg={modoOscuro ? "bg-gray-800 border border-gray-700" : "bg-emerald-50 border border-emerald-200"}
          />
        </div>

        {/* PESTAÑAS */}
        <div className="flex flex-wrap justify-center gap-1 mx-8 pb-2">
          {[ 
            { id: "descripcion", icon: FaRegFileAlt, label: "Descripción", color: "text-blue-500" },
            { id: "objetivos", icon: FaCheckCircle, label: "Objetivos", color: "text-green-500" },
            { id: "recursos", icon: FaRegBookmark, label: "Recursos", color: "text-yellow-500" },
            { id: "notas", icon: FaSearch, label: "Notas", color: "text-orange-500" },
            { id: "masInformacion", icon: FaInfoCircle, label: "Más información", color: "text-purple-500" },
          ].map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setPestanaActiva(id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm rounded-lg font-medium transition-all duration-200 
                ${pestanaActiva === id
                  ? `${modoOscuro ? "bg-gray-700 text-white" : "bg-white text-gray-900"} ${color}`
                  : `${modoOscuro ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}`}
            >
              <Icon className="text-base" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div
          className={`p-6 mx-8 rounded-xl min-h-[150px] mb-6 shadow-md ${
            modoOscuro
              ? "bg-gray-900 text-gray-200 border border-gray-700"
              : "bg-white text-gray-700 border border-gray-200"
          }`}
        >
          {pestanaActiva === "descripcion" && (
            <>
              <h4 className="text-lg font-semibold mb-3">Descripción</h4>
              <p className="leading-relaxed">{convocatoria.description}</p>
            </>
          )}
          {pestanaActiva === "objetivos" && (
            <>
              <h4 className="text-lg font-semibold mb-3">Objetivos</h4>
              <p className="leading-relaxed">{convocatoria.objective}</p>
            </>
          )}
          {pestanaActiva === "recursos" && (
            <>
              <h4 className="text-lg font-semibold mb-3">Recursos</h4>
              <p className="leading-relaxed">{convocatoria.resources}</p>
            </>
          )}
          {pestanaActiva === "notas" && (
            <>
              <h4 className="text-lg font-semibold mb-3">Notas</h4>
              <p className="leading-relaxed">{convocatoria.notes}</p>
            </>
          )}
          {pestanaActiva === "masInformacion" && (
            <>
              <h4 className="text-lg font-semibold mb-4">Más Información</h4>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm rounded-xl p-5 shadow-inner max-w-[900px] mx-auto ${
                  modoOscuro
                    ? "bg-gray-800 border border-gray-600"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <Info label="Público Objetivo" value={getNombre(publicos, convocatoria.targetAudienceId)} modoOscuro={modoOscuro} />
                <Info label="Página Asociada" value={convocatoria.pageName} modoOscuro={modoOscuro} />
                <Info
                  label="URL Página"
                  value={<a href={convocatoria.pageUrl} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1"><FaExternalLinkAlt /> Abrir enlace</a>}
                  modoOscuro={modoOscuro}
                />
                <Info
                  label="Enlace de Convocatoria"
                  value={<a href={convocatoria.callLink} target="_blank" className="text-green-400 hover:underline flex items-center gap-1"><FaLink /> Ver convocatoria</a>}
                  modoOscuro={modoOscuro}
                />
              </div>
            </>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 px-8 pb-6">
          <a
            href={convocatoria.callLink}
            target="_blank"
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
          >
            <FaCheckCircle /> Inscribirse
          </a>
          <button
            onClick={cerrarModal}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow transition"
          >
            <FaTimes /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Tarjeta color pastel */
function CardInfo({ icon, title, value, bg }: { icon: JSX.Element; title: string; value: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center shadow-sm transform transition-all duration-300 hover:scale-105`}>
      {icon}
      <p className="text-sm font-medium mb-1">{title}</p>
      <strong className="text-lg">{value}</strong>
    </div>
  );
}

/* 🔹 Bloques adaptados a modo oscuro */
function Info({ label, value, modoOscuro }: { label: string; value: any; modoOscuro: boolean }) {
  return (
    <div className={`p-4 rounded-lg flex flex-col gap-1 transition-all ${
      modoOscuro
        ? "bg-gray-900 border border-gray-600 text-gray-100"
        : "bg-white border border-gray-300 text-gray-800"
    }`}>
      <div className="font-medium opacity-80">{label}:</div>
      <div className="text-base">{value || "—"}</div>
    </div>
  );
}
