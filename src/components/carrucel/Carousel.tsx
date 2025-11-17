"use client";

import { asignarImagenesPorDefecto } from "@/utils/asignarImagenesPorDefecto";
import { useState, useEffect } from "react";
import {
  FiAward, FiCheckCircle, FiChevronLeft, FiChevronRight, FiEye
} from "react-icons/fi";
import ModalConvocatoria from "../detalleConvo/detalleConvo";
import { getConvocatorias } from "@/app/api/convocatorias/routes";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // Obtener ID real
  const getConvocatoriaCallId = (c: Convocatoria | null) => {
    if (!c) return null;
    return Number(c.callId ?? c.id ?? null);
  };

  // Registrar click + evitar duplicados
  const registrarClickConvocatoria = async (callId: number | null, idx: number) => {
    if (!callId) return;

    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) return;

    let userId = null;

    try {
      const usuario = JSON.parse(usuarioGuardado);
      userId =
        Number(usuario?.id) ||
        Number(usuario?.userId) ||
        Number(usuario?.uid) ||
        Number(usuario?.uId);
    } catch { return; }

    if (!userId) return;

    // Evitar doble conteo
    const vistos = JSON.parse(localStorage.getItem("conv_clicks") || "[]");
    if (vistos.includes(callId)) return;

    try {
      await fetch(`${API_URL}/calls/${callId}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // marcar como visto
      vistos.push(callId);
      localStorage.setItem("conv_clicks", JSON.stringify(vistos));

      // 🔥 Actualizar el estado del carrusel para que el contador suba en pantalla
      setConvocatorias((prev) => {
        const nuevo = [...prev];
        nuevo[idx].clickCount = (nuevo[idx].clickCount ?? 0) + 1;
        return nuevo;
      });

    } catch (err) {
      console.error("Error registrando click:", err);
    }
  };

  // Cargar convocatorias TOP 10
  useEffect(() => {
    (async () => {
      try {
        const data = await getConvocatorias();
        const lista = asignarImagenesPorDefecto(data?.data || []);

        const top10 = lista
          .sort((a, b) => b.clickCount - a.clickCount)
          .slice(0, 10);

        setConvocatorias(top10);

      } catch (err) {
        console.error("❌ Error al cargar convocatorias:", err);
        Swal.fire("Error", "No se pudieron cargar las convocatorias.", "error");
      }
    })();
  }, []);

  // Rotación automática
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
        Cargando convocatorias destacadas...
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

      {/* Imagen fondo */}
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

          <div className="flex items-center gap-4">
            <FiAward className="text-4xl text-white" />
            <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/20">
              ⚡ Convocatorias Destacadas
            </span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight line-clamp-2 max-w-2xl">
            {current.title}
          </h2>

          <p className="text-base opacity-90 leading-relaxed line-clamp-3 max-w-2xl">
            {current.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">

            {/* 🔥 INSCRIBIRSE */}
            <button
              onClick={() => {
                const cid = getConvocatoriaCallId(current);

                if (cid) registrarClickConvocatoria(cid, index);

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
                  });
                }
              }}
              className="px-7 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-full flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
            >
              <FiCheckCircle /> Inscríbete Ahora
            </button>

            {/* VER DETALLES */}
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
        className="absolute top-1/2 -translate-y-1/2 left-0 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-20 backdrop-blur-sm transition"
      >
        <FiChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-4 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-20 backdrop-blur-sm transition"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {convocatorias.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
