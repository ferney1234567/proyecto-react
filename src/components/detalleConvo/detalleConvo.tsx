"use client";

import { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaCalendarTimes,
  FaBuilding,
  FaRegFileAlt,
  FaCheckCircle,
  FaRegBookmark,
  FaSearch,
  FaInfoCircle,
  FaLink,
  FaGlobe,
  FaListAlt,
  FaUsers,
  FaStar,
  FaUser,
  FaTimes,
} from "react-icons/fa";

interface Convocatoria {
  id: number;
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

  // ✅ Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cerrarModal]);

  if (!modalAbierto || !convocatoria) return null;

  return (
    <div
      onClick={cerrarModal}
      className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] 
                   rounded-2xl w-[90%] max-w-4xl max-h-[90vh] 
                   overflow-y-scroll scrollbar-hide shadow-2xl 
                   animate-fade-in border border-gray-200"
      >
        {/* ENCABEZADO */}
        <div className="p-6 px-8 flex justify-between items-center bg-gradient-to-r from-[#00324D] to-[#00668c] rounded-t-2xl">
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
            className="w-full max-w-[1000px] max-h-[400px] object-cover rounded-xl shadow-md border border-gray-200"
          />
        </div>

        {/* INFO CARDS */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mx-8 mb-6">
  <div className="bg-blue-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center">
    <FaCalendarAlt className="text-blue-500 text-3xl mb-2" />
    <p className="text-sm text-gray-600 font-medium">Fecha de Apertura</p>
    <strong className="text-gray-800 text-base font-semibold">
      {new Date(convocatoria.openDate).toLocaleDateString()}
    </strong>
  </div>
  <div className="bg-red-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center">
    <FaCalendarTimes className="text-red-500 text-3xl mb-2" />
    <p className="text-sm text-gray-600 font-medium">Fecha de Cierre</p>
    <strong className="text-gray-800 text-base font-semibold">
      {new Date(convocatoria.closeDate).toLocaleDateString()}
    </strong>
  </div>
  <div className="bg-purple-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 flex flex-col items-center text-center">
    <FaBuilding className="text-purple-600 text-3xl mb-2" />
    <p className="text-sm text-gray-600 font-medium">Entidad</p>
    <strong className="text-gray-800 text-base font-semibold">
      {convocatoria.institutionId}
    </strong>
  </div>
</div>

        {/* PESTAÑAS */}
        <div className="flex flex-wrap justify-center gap-1 mx-8 border-b border-gray-200 pb-2">
          {[
            { id: "descripcion", icon: FaRegFileAlt, label: "Descripción", color: "text-blue-600" },
            { id: "objetivos", icon: FaCheckCircle, label: "Objetivos", color: "text-green-600" },
            { id: "recursos", icon: FaRegBookmark, label: "Recursos", color: "text-yellow-600" },
            { id: "observaciones", icon: FaSearch, label: "Observaciones", color: "text-orange-600" },
            { id: "masInformacion", icon: FaInfoCircle, label: "Más información", color: "text-purple-600" },
          ].map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setPestanaActiva(id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 ${
                pestanaActiva === id
                  ? `bg-white shadow-sm ${color} border-t-2 border-${color.split("-")[1]}-500`
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`text-base ${pestanaActiva === id ? color : "text-gray-400"}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>

      {/* CONTENIDO PESTAÑAS */}
<div className="bg-white p-6 mx-8 rounded-xl min-h-[150px] mb-6 shadow-sm border border-gray-100">
  {pestanaActiva === "descripcion" && (
    <p className="text-sm text-gray-700 leading-relaxed">{convocatoria.description}</p>
  )}
  {pestanaActiva === "objetivos" && (
    <p className="text-sm text-gray-700 leading-relaxed">{convocatoria.objective}</p>
  )}
  {pestanaActiva === "recursos" && (
    <p className="text-sm text-gray-700 leading-relaxed">{convocatoria.resources}</p>
  )}
  {pestanaActiva === "observaciones" && (
    <p className="text-sm text-gray-700 leading-relaxed">{convocatoria.notes}</p>
  )}
  {pestanaActiva === "masInformacion" && (
    <div className="space-y-3 text-sm text-gray-700">
      <p><strong>Link Convocatoria:</strong>{" "}
        <a href={convocatoria.callLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
          {convocatoria.callLink}
        </a>
      </p>
      <p><strong>Página:</strong> {convocatoria.pageName}</p>
      <p><strong>URL:</strong>{" "}
        <a href={convocatoria.pageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
          {convocatoria.pageUrl}
        </a>
      </p>
      <p><strong>Público Objetivo:</strong> {convocatoria.targetAudienceId}</p>
      <p><strong>Área de Interés:</strong> {convocatoria.interestId}</p>
      <p><strong>Usuario Responsable:</strong> {convocatoria.userId}</p>
      <p><strong>Clicks registrados:</strong> {convocatoria.clickCount}</p>
    </div>
  )}
</div>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-8 pt-6 pb-8 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={cerrarModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold flex items-center justify-center gap-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
          >
            <FaTimes /> Cancelar
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#39A900] to-[#2a8200] text-white font-semibold flex items-center justify-center gap-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200">
            <FaCheckCircle /> Inscribirse
          </button>
        </div>
      </div>
    </div>
  );
}
