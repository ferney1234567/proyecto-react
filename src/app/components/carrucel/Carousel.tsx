'use client';

import { useState, useEffect } from 'react';
import {
  FiBriefcase,
  FiAward,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from 'react-icons/fi';
import ModalConvocatoria from '../detalleConvo/detalleConvo'; // Ajusta la ruta

const slides = [
  {
    title: "Impulsa tu Talento Digital 2025",
    description: "Conviértete en un profesional destacado en el sector tecnológico con el apoyo del SENA.",
    tags: ["Desarrollo Web", "Ciencia de Datos", "Ciberseguridad"],
    btnText: "Inscríbete Ahora",
    icon: <FiAward className="text-4xl text-white" />,
    image: "/img/cienciasSalud.jpg",
  },
  {
    title: "Convocatoria Nacional de Empleo",
    description: "Descubre miles de oportunidades laborales con nuestras empresas aliadas en todo el país.",
    tags: ["Oportunidades", "Crecimiento Profesional", "Empresas Aliadas"],
    btnText: "Aplica Ahora",
    icon: <FiBriefcase className="text-4xl text-white" />,
    image: "/img/R.jpg",
  },
  {
    title: "Industria 4.0: El Futuro es Ahora",
    description: "Capacítate en las tecnologías que están transformando la industria a nivel global.",
    tags: ["Innovación", "Automatización", "Tecnología"],
    btnText: "Comienza tu Formación",
    icon: <FiAward className="text-4xl text-white" />,
    image: "/img/fabricas.jpg",
  },
  {
    title: "Jóvenes con Futuro Laboral",
    description: "Programas especiales para que los jóvenes inicien su carrera profesional con éxito.",
    tags: ["Primer Empleo", "Desarrollo", "Juventud"],
    btnText: "Inscríbete Ahora",
    icon: <FiBriefcase className="text-4xl text-white" />,
    image: "/img/jove.jpg",
  },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);

  const current = slides[index];

  return (
    <div className="relative h-[380px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src={current.image}
          alt="slide"
          className="w-full h-full object-cover transition-transform duration-1000 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 z-10 text-white h-full">
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-4 h-full backdrop-blur-md">
          {/* Encabezado */}
          <div className="flex items-center gap-4">
            {current.icon}
            <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/20">
              ⚡ Convocatorias Destacadas
            </span>
          </div>

          {/* Título y descripción */}
          <h2 className="text-4xl font-extrabold tracking-tight">{current.title}</h2>
          <p className="text-base opacity-90">{current.description}</p>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2">
            {current.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 border border-white/30 bg-white/10 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Botones (más arriba) */}
          <div className="flex gap-4 pt-2">
            <button className="px-7 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold rounded-full flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300">
              <FiCheckCircle /> {current.btnText}
            </button>
            <button
              onClick={() => setModalAbierto(true)}
              className="border-2 border-white/50 text-white px-7 py-3 text-sm font-bold rounded-full hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2"
            >
              <FiEye /> Ver Detalles
            </button>
          </div>
        </div>

        {/* Lado derecho vacío */}
        <div className="hidden md:block" />
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
        {slides.map((_, i) => (
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
      />
    </div>
  );
}
