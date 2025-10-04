'use client';

import { useState, useEffect } from 'react';
import {
  FiAward,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from 'react-icons/fi';
import ModalConvocatoria from '../detalleConvo/detalleConvo'; // Ajusta la ruta

// Interfaz Convocatoria (basada en tu tabla Calls)
interface Convocatoria {
  id: number;
  title: string;
  description: string;
  resources?: string;
  callLink?: string;
  openDate?: string;
  closeDate?: string;
  pageName?: string;
  pageUrl?: string;
  objective?: string;
  notes?: string;
  institutionId?: number;
  lineId?: number;
  targetAudienceId?: number;
  interestId?: number;
  userId?: number;
  clickCount?: number;
  imageUrl?: string;
}

export default function Carousel() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [index, setIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);

  // Traer convocatorias desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/calls");
        const data = await res.json();
        if (data.status === "Ok" && Array.isArray(data.data)) {
          setConvocatorias(data.data);
        }
      } catch (error) {
        console.error("❌ Error al traer convocatorias:", error);
      }
    };
    fetchData();
  }, []);

  // Rotación automática cada 7s
  useEffect(() => {
    if (convocatorias.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % convocatorias.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [convocatorias]);

  if (convocatorias.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
        Cargando convocatorias...
      </div>
    );
  }

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + convocatorias.length) % convocatorias.length);
  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % convocatorias.length);

  const current = convocatorias[index];

  return (
    <div className="relative h-[380px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src={current.imageUrl || "/img/default.jpg"}
          alt={current.title}
          className="w-full h-full object-cover transition-transform duration-1000 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 z-10 text-white h-full">
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-4 h-full backdrop-blur-md">
          {/* Encabezado */}
          <div className="flex items-center gap-4">
            <FiAward className="text-4xl text-white" />
            <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/20">
              ⚡ Convocatorias Destacadas
            </span>
          </div>

          {/* Título y descripción */}
         {/* Título y descripción */}
<h2 className="text-4xl font-extrabold tracking-tight">{current.title}</h2>
<p className="text-base opacity-90 line-clamp-2">{current.description}</p>


          {/* Botones */}
          <div className="flex gap-4 pt-2">
            <a
              href={current.callLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-full flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
            >
              <FiCheckCircle /> Inscríbete Ahora
            </a>
            <button
              onClick={() => {
                setConvocatoriaSeleccionada(current);
                setModalAbierto(true);
              }}
              className="border-2 border-white/50 text-white px-7 py-3 text-sm font-bold rounded-full hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2"
            >
              <FiEye /> Ver Detalles
            </button>
          </div>
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-0 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-20 transition-colors duration-300 backdrop-blur-sm"
      >
        <FiChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-20 transition-colors duration-300 backdrop-blur-sm"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {convocatorias.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index ? 'bg-white scale-125' : 'bg-white/40'
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Ir al slide ${i + 1}`}
          ></button>
        ))}
      </div>

      {/* Modal */}
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
