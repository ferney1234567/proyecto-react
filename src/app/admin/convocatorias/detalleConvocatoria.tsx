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

  const bgColor = modoOscuro ? "bg-[#0e0820]" : "bg-white";
  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const borderColor = modoOscuro ? "border-gray-700" : "border-gray-200";
  const sectionTitle = modoOscuro ? "text-green-400" : "text-green-700";
  const secondaryText = modoOscuro ? "text-gray-300" : "text-gray-700";
  const linkColor = "text-[#39A900] hover:text-[#2d8500]";
  const cardBg = modoOscuro ? "bg-[#1b1b2f]" : "bg-gray-50";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6"
        onClick={handleOutsideClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className={`relative rounded-3xl shadow-2xl w-full max-w-7xl flex flex-col ${bgColor} ${textColor} border ${borderColor}`}
          style={{
            maxHeight: "90vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
          initial={{ scale: 0.95, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Cerrar */}
          <button
            onClick={cerrarModal}
            className="absolute top-4 right-5 text-red-500 hover:text-red-600 transition"
            title="Cerrar"
          >
            <XCircle size={38} />
          </button>

          {/* Imagen principal */}
          {convocatoria.imageUrl && (
            <div className="relative">
              <img
                src={convocatoria.imageUrl}
                alt={convocatoria.title}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <h2 className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
                  {convocatoria.title}
                </h2>
              </div>
            </div>
          )}

          {/* Contenido */}
          <div className="p-10 space-y-10 text-[15px] leading-relaxed">

            {/* Descripción */}
            <section>
              <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Info size={20} /> Descripción
              </h3>
              <p className={`text-justify ${secondaryText}`}>
                {convocatoria.description || "Sin descripción disponible."}
              </p>
            </section>

            {/* Objetivo */}
            {convocatoria.objective && (
              <section>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <Target size={20} /> Objetivo
                </h3>
                <p className={`text-justify ${secondaryText}`}>{convocatoria.objective}</p>
              </section>
            )}

            {/* Recursos */}
            {convocatoria.resources && (
              <section>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <FileText size={20} /> Recursos Disponibles
                </h3>
                <p className={secondaryText}>{convocatoria.resources}</p>
              </section>
            )}

            {/* Notas */}
            {convocatoria.notes && (
              <section>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                  <Layers size={20} /> Notas Adicionales
                </h3>
                <p className={`text-justify ${secondaryText}`}>{convocatoria.notes}</p>
              </section>
            )}

            {/* Fechas */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-5 rounded-2xl border-l-4 border-green-500 ${
                  modoOscuro ? "bg-green-900/20" : "bg-green-100/40"
                }`}
              >
                <p className="flex items-center gap-2 text-[15px] font-semibold text-green-500">
                  <Calendar size={18} /> Fecha de Apertura
                </p>
                <p className="mt-1 text-sm">
                  {new Date(convocatoria.openDate).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border-l-4 border-red-500 ${
                  modoOscuro ? "bg-red-900/20" : "bg-red-100/40"
                }`}
              >
                <p className="flex items-center gap-2 text-[15px] font-semibold text-red-500">
                  <Calendar size={18} /> Fecha de Cierre
                </p>
                <p className="mt-1 text-sm">
                  {new Date(convocatoria.closeDate).toLocaleDateString()}
                </p>
              </div>
            </section>

            {/* Enlaces */}
            <section>
              <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Globe size={20} /> Enlaces Relacionados
              </h3>
              <div className="flex flex-col gap-3">
                {convocatoria.callLink && (
                  <a
                    href={convocatoria.callLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 font-semibold ${linkColor}`}
                  >
                    <Link2 size={18} /> Convocatoria Oficial
                  </a>
                )}
                {convocatoria.pageUrl && (
                  <a
                    href={convocatoria.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 font-semibold ${linkColor}`}
                  >
                    <Link2 size={18} /> Página Institucional
                  </a>
                )}
              </div>
            </section>

            {/* Información Completa */}
            <section className="border-t pt-6 mt-6">
              <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${sectionTitle}`}>
                <Eye size={20} /> Información Completa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard icon={<Building2 size={16} />} label="Entidad" value={nombresRelacionados.entidad || "Sin asignar"} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                <InfoCard icon={<Bookmark size={16} />} label="Línea" value={nombresRelacionados.linea || "Sin asignar"} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                <InfoCard icon={<Users size={16} />} label="Público Objetivo" value={nombresRelacionados.publico || "Sin asignar"} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                <InfoCard icon={<Network size={16} />} label="Interés" value={nombresRelacionados.interes || "Sin asignar"} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                <InfoCard icon={<User size={16} />} label="Usuario" value={nombresRelacionados.usuario || "Sin asignar"} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                <InfoCard icon={<Eye size={16} />} label="Clicks" value={convocatoria.clickCount || 0} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                {convocatoria.pageName && (
                  <InfoCard icon={<Globe size={16} />} label="Página" value={convocatoria.pageName} borderColor={borderColor} bg={cardBg} text={secondaryText} />
                )}
              </div>
            </section>

            {/* Botón */}
            <div className="flex justify-center pt-8">
              <button
                onClick={cerrarModal}
                className="flex items-center gap-2 px-8 py-3 bg-[#39A900] text-white text-[15px] font-semibold rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-lg"
              >
                <CheckCircle size={18} /> Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* === CARD AUXILIAR === */
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
      <p className="flex items-center gap-2 font-semibold text-[14px] mb-1">{icon} {label}:</p>
      <p className={`${text} text-[14px]`}>{value}</p>
    </div>
  );
}
