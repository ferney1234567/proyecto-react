'use client';

import {
  XCircle,
  Calendar,
  Globe,
  Info,
  FileText,
  Link2,
  Target,
  Layers,
  Eye,
  Users,
  Building2,
  Bookmark,
  Network,
  User,
  Hash,
  CheckCircle,
} from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DetalleConvocatoriaModal({
  convocatoria,
  cerrarModal,
  modoOscuro,
  nombresRelacionados = {},
}: {
  convocatoria: any;
  cerrarModal: () => void;
  modoOscuro: boolean;
  nombresRelacionados?: {
    entidad?: string;
    linea?: string;
    publico?: string;
    interes?: string;
    usuario?: string;
  };
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      cerrarModal();
    }
  };

  // 🎨 Estilos
  const bgColor = modoOscuro ? "bg-[#1a0526]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-white/20" : "border-gray-200";
  const sectionTitle = modoOscuro ? "text-green-400" : "text-green-700";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-700";
  const linkColor = "text-[#39A900] hover:text-[#2d8500]";
  const cardBg = modoOscuro ? "bg-white/10" : "bg-white";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={handleOutsideClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className={`relative rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col ${bgColor} ${textColor} border ${borderColor}`}
          style={{
            maxHeight: "90vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Oculta barra de desplazamiento */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* BOTÓN DE CIERRE */}
          <button
            onClick={cerrarModal}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            title="Cerrar"
          >
            <XCircle size={36} />
          </button>

          {/* IMAGEN PRINCIPAL */}
          {convocatoria.imageUrl && (
            <div className="relative">
              <img
                src={convocatoria.imageUrl}
                alt={convocatoria.title}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                  {convocatoria.title}
                </h2>
              </div>
            </div>
          )}

          {/* CONTENIDO */}
          <div className="p-10 space-y-10">

            {/* DESCRIPCIÓN */}
            <section>
              <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Info size={22} /> Descripción
              </h3>
              <p className={`leading-relaxed text-justify text-lg ${secondaryText}`}>
                {convocatoria.description || "Sin descripción disponible."}
              </p>
            </section>

            {/* OBJETIVO */}
            {convocatoria.objective && (
              <section>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <Target size={22} /> Objetivo
                </h3>
                <p className={`leading-relaxed text-justify text-lg ${secondaryText}`}>
                  {convocatoria.objective}
                </p>
              </section>
            )}

            {/* RECURSOS */}
            {convocatoria.resources && (
              <section>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <FileText size={22} /> Recursos Disponibles
                </h3>
                <p className={`leading-relaxed text-lg ${secondaryText}`}>
                  {convocatoria.resources}
                </p>
              </section>
            )}

            {/* NOTAS */}
            {convocatoria.notes && (
              <section>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <Layers size={22} /> Notas Adicionales
                </h3>
                <p className={`leading-relaxed text-justify text-lg ${secondaryText}`}>
                  {convocatoria.notes}
                </p>
              </section>
            )}

            {/* FECHAS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-5 rounded-2xl border-l-4 border-green-500 shadow-md ${
                  modoOscuro ? "bg-green-900/20" : "bg-green-100/40"
                }`}
              >
                <p className="flex items-center gap-2 text-lg font-semibold text-green-500">
                  <Calendar size={20} /> Fecha de Apertura
                </p>
                <p className="mt-1 text-base">
                  {new Date(convocatoria.openDate).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border-l-4 border-red-500 shadow-md ${
                  modoOscuro ? "bg-red-900/20" : "bg-red-100/40"
                }`}
              >
                <p className="flex items-center gap-2 text-lg font-semibold text-red-500">
                  <Calendar size={20} /> Fecha de Cierre
                </p>
                <p className="mt-1 text-base">
                  {new Date(convocatoria.closeDate).toLocaleDateString()}
                </p>
              </div>
            </section>

            {/* ENLACES */}
            <section>
              <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Globe size={22} /> Enlaces Relacionados
              </h3>
              <div className="flex flex-col gap-3">
                {convocatoria.callLink && (
                  <a
                    href={convocatoria.callLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-lg font-semibold ${linkColor}`}
                  >
                    <Link2 size={20} /> Convocatoria Oficial
                  </a>
                )}
                {convocatoria.pageUrl && (
                  <a
                    href={convocatoria.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-lg font-semibold ${linkColor}`}
                  >
                    <Link2 size={20} /> Página Institucional
                  </a>
                )}
              </div>
            </section>

            {/* INFORMACIÓN COMPLETA */}
            <section className="border-t pt-5 mt-5">
              <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Eye size={22} /> Información Completa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base opacity-90">
                <InfoCard
                  icon={<Building2 size={18} />}
                  label="Entidad"
                  value={nombresRelacionados.entidad || "Sin asignar"}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                <InfoCard
                  icon={<Bookmark size={18} />}
                  label="Línea"
                  value={nombresRelacionados.linea || "Sin asignar"}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                <InfoCard
                  icon={<Users size={18} />}
                  label="Público Objetivo"
                  value={nombresRelacionados.publico || "Sin asignar"}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                <InfoCard
                  icon={<Network size={18} />}
                  label="Interés"
                  value={nombresRelacionados.interes || "Sin asignar"}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                <InfoCard
                  icon={<User size={18} />}
                  label="Usuario"
                  value={nombresRelacionados.usuario || "Sin asignar"}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                <InfoCard
                  icon={<Eye size={18} />}
                  label="Clicks"
                  value={convocatoria.clickCount || 0}
                  borderColor={borderColor}
                  bg={cardBg}
                  text={secondaryText}
                />
                {convocatoria.pageName && (
                  <InfoCard
                    icon={<Globe size={18} />}
                    label="Página"
                    value={convocatoria.pageName}
                    borderColor={borderColor}
                    bg={cardBg}
                    text={secondaryText}
                  />
                )}
              </div>
            </section>

            {/* BOTÓN ACEPTAR */}
            <div className="flex justify-center pt-6">
              <button
                onClick={cerrarModal}
                className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white font-semibold text-lg rounded-2xl hover:bg-[#2d8500] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <CheckCircle size={22} /> Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* === COMPONENTE AUXILIAR === */
function InfoCard({
  icon,
  label,
  value,
  borderColor,
  bg,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  borderColor: string;
  bg: string;
  text: string;
}) {
  return (
    <div className={`p-4 rounded-2xl border ${borderColor} ${bg}`}>
      <p className="flex items-center gap-2 font-semibold">{icon} {label}:</p>
      <p className={`${text}`}>{value}</p>
    </div>
  );
}
