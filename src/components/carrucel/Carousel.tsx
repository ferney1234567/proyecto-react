"use client";

import { asignarImagenesPorDefecto } from "@/utils/asignarImagenesPorDefecto";
import { useState, useEffect } from "react";
import {
  FiAward, FiCheckCircle, FiChevronLeft, FiChevronRight, FiEye
} from "react-icons/fi";
import ModalConvocatoria from "../detalleConvo/detalleConvo";
import { getConvocatorias } from "@/app/api/convocatorias/routes";
import Swal from "sweetalert2";

interface Convocatoria {
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

export default function Carousel() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [index, setIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
    useState<Convocatoria | null>(null);

  // ✅ Cargar convocatorias
  useEffect(() => {
    (async () => {
      try {
        const data = await getConvocatorias();
        const listaConImagenes = asignarImagenesPorDefecto(data?.data || []);
        setConvocatorias(listaConImagenes);
      } catch (err) {
        console.error("❌ Error al cargar convocatorias:", err);
        Swal.fire("Error", "No se pudieron cargar las convocatorias.", "error");
      }
    })();
  }, []);

  // ✅ Rotación automática
  useEffect(() => {
    if (convocatorias.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % convocatorias.length);
    }, 7000);
    return () => clearInterval(timer);
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

  // 👉 Verificar si el usuario ya registró un click
const usuarioYaRegistroClick = (callId: number) => {
  const vistos = JSON.parse(localStorage.getItem("conv_clicks") || "[]");
  return vistos.includes(callId);
};

// 👉 Guardar que el usuario ya hizo click
const marcarComoVisto = (callId: number) => {
  const vistos = JSON.parse(localStorage.getItem("conv_clicks") || "[]");
  if (!vistos.includes(callId)) {
    vistos.push(callId);
    localStorage.setItem("conv_clicks", JSON.stringify(vistos));
  }
};


const registrarClick = async (callId?: number) => {
  try {
    if (!callId) return; // ⛔ No enviamos undefined
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    await fetch(`${API_URL}/calls/${callId}/click`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Error registrando click:", error);
  }
};




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
          <h2
            className="text-4xl font-extrabold tracking-tight leading-tight line-clamp-2 max-w-2xl"
            title={current.title}
          >
            {current.title}
          </h2>

          <p
            className="text-base opacity-90 leading-relaxed line-clamp-3 max-w-2xl"
            title={current.description}
          >
            {current.description}
          </p>

          {/* Botones */}
          {/* Botones */}
<div className="flex flex-wrap gap-4 pt-2">
  <button
  onClick={async () => {

    // 👈 Registrar el click en la BD
   registrarClick(current.id ?? current.callId);


    // 👇 Abrir enlace
    if (current.callLink) {
      window.open(current.callLink, "_blank");
    } else if (current.pageUrl) {
      window.open(current.pageUrl, "_blank");
    } else {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Enlace no disponible",
        text: "Esta convocatoria no tiene un enlace de inscripción activo.",
        confirmButtonColor: "#39A900",
        background: "#0b1220",
        color: "#fff",
      });
    }
  }}
  className="px-7 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-full flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
>
  <FiCheckCircle /> Inscríbete Ahora
</button>


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
              i === index ? "bg-white scale-125" : "bg-white/40"
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
