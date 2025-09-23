'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FaSearch, FaRegBookmark, FaSearchLocation, FaGlobe, FaBriefcase,
  FaGraduationCap, FaTools, FaCertificate, FaUserGraduate, FaPlane,
  FaTags, FaCalendarAlt, FaClock, FaRegFileAlt, FaCheckCircle,
  FaCalendarTimes, FaStar, FaRegStar, FaMobileAlt,
  FaStethoscope,
  FaGavel,
  FaLaptopCode,
  FaBalanceScale,
  FaChalkboardTeacher,
  FaHardHat,
  FaPaintBrush,
  FaTractor
} from 'react-icons/fa';
import { MdWorkspacePremium } from 'react-icons/md';
import Link from "next/link";
import Carousel from "../../components/carrucel/Carousel";
import ModalConvocatoria from '../../components/detalleConvo/detalleConvo'; // Ajusta la ruta
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { getConvocatorias } from "../api/convocatorias/routes";
import { getLineas } from "../api/linea/routes";
import Swal from "sweetalert2";

// 👇 Tema
import { useTheme } from "../ThemeContext";   // 👈 Usa el contexto global
import { getThemeStyles } from "../themeStyles"; // 👈 Utilidades de estilo

export default function HomePage() {
  // 👉 Estado de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;

  // 👉 Estado de convocatorias
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);

  // 👉 Estado de línea seleccionada
  const [lineaSeleccionada, setLineaSeleccionada] = useState<number | null>(null);

  // 👉 Filtrado de convocatorias según línea seleccionada
  const convocatoriasFiltradas = lineaSeleccionada
    ? convocatorias.filter((c) => c.lineId === lineaSeleccionada)
    : convocatorias;

  const totalPaginas = Math.ceil(convocatoriasFiltradas.length / convocatoriasPorPagina);
  const indiceInicio = (paginaActual - 1) * convocatoriasPorPagina;
  const indiceFin = indiceInicio + convocatoriasPorPagina;
  const convocatoriasPagina = convocatoriasFiltradas.slice(indiceInicio, indiceFin);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [destacado, setDestacado] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);

  // 👉 Ver más / expandida (por-card, con offsets)
  const [verMasDestacada, setVerMasDestacada] = useState(false);
  const [expandida, setExpandida] = useState<number | null>(null);

  // 👉 Modo oscuro desde contexto global
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  const [lineas, setLineas] = useState<{ id: number; name: string }[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);



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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConvocatorias();
        setConvocatorias(data.data || []); // tu backend devuelve { data: [...] }
      } catch (err) {
        console.error("Error al cargar convocatorias", err);
      }
    };
    fetchData();
  }, []);

  // 👉 Scroll del carrusel
  const scroll = (direccion: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direccion === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  // 👉 Línea gradiente animada (decorativa)
  useEffect(() => {
    const linea = document.getElementById('lineaGradiente');
    function generarColorAleatorio() {
      const letras = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) color += letras[Math.floor(Math.random() * 16)];
      return color;
    }
    function actualizarColores() {
      if (!linea) return;
      const c1 = generarColorAleatorio();
      const c2 = generarColorAleatorio();
      const c3 = generarColorAleatorio();
      const c4 = generarColorAleatorio();
      linea.style.background = `linear-gradient(to right, ${c1}, ${c2}, ${c3}, ${c4})`;
    }
    const intervalo = setInterval(actualizarColores, 3000);
    return () => clearInterval(intervalo);
  }, []);



  // 👉 Favoritos
  const handleFavorito = () => {
    const nuevoEstado = !destacado;
    setDestacado(nuevoEstado);
    Swal.fire({
      icon: nuevoEstado ? "success" : "warning",
      title: nuevoEstado ? "¡Agregado a favoritos!" : "Eliminado de favoritos",
      text: nuevoEstado ? "Este elemento ahora está en tu lista" : "Ya no está en tu lista",
      position: "center",
      confirmButtonText: nuevoEstado ? "OK" : "Entendido",
      confirmButtonColor: nuevoEstado ? "#3085d6" : "#d33",
      background: modoOscuro ? "#0e1626" : "#fff",
      color: modoOscuro ? "#e5e7eb" : "#111827",
    });
  };
  useEffect(() => {
    const fetchLineas = async () => {
      try {
        const res = await getLineas();
        setLineas(res.data || []); // 👈 solo guardamos el array
      } catch (err) {
        console.error("Error al cargar líneas", err);
      }
    };
    fetchLineas();
  }, []);



  return (
    <div className={`min-h-[100vh] transition-colors duration-500 ${styles.fondo}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl ${styles.card}`}>
        {/* HEADER */}
        <header className="p-4">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
            {/* Logo + buscador */}
            <div className="flex flex-col gap-6 w-full">
              {/* Logo */}
              <div className="flex justify-start -mt-2">
                <img src="/img/sena.png" alt="Logo Izquierdo" className="h-16 w-auto object-contain" />
              </div>
              {/* BUSCADOR */}
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  placeholder="Buscar convocatorias, programas, becas..."
                  className={`pl-12 pr-6 py-2 rounded-full w-full focus:outline-none focus:ring-2 ${styles.input}`}
                />
                <FaSearch className={`absolute left-4 top-3.5 ${styles.textMuted}`} />
              </div>
            </div>

            {/* Derecha: nav + modo oscuro */}
            <div className="flex flex-col items-end space-y-3">
              <div className="flex justify-end">
                <img src="/img/logo.png" alt="Logo Derecho" className="h-14 w-auto object-contain" />
              </div>

              <nav className="flex items-center space-x-6 border-t pt-3">
                <Link href="/menu" className={`flex items-center space-x-1 ${styles.navActive}`}>
                  <FaTags className="text-sm" />
                  <span>Descubrir</span>
                </Link>
                <Link href="/public/explorar/" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaSearchLocation className="text-sm" />
                  <span>Explorar</span>
                </Link>
                <Link href="/usuario/favoritos" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaRegBookmark className="text-sm" />
                  <span>Favoritos</span>
                </Link>
                {/* Avatar */}
                <Link href="/usuario/perfilUser">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md ${modoOscuro ? "bg-gray-600 text-white" : "bg-[#8f928f] text-white"}`}>
                    f
                  </div>
                </Link>
              </nav>

              {/* Toggle modo oscuro */}
              <div className="fixed top-6 right-6 z-50">
                <button
                  onClick={toggleModoOscuro}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  title="Cambiar modo"
                >
                  {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="p-4">
          {/* Carrusel */}
          <div className="mb-8">
            <Carousel />
          </div>

          {/* Sección título y filtros */}
          <section className="group">
            <h2 className={`text-3xl font-bold mt-8 mb-2 flex items-center gap-2 ${styles.text}`}>
              <span className="group-hover:rotate-6 transition-transform duration-500 text-emerald-400">
                <FaSearchLocation />
              </span>
              <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-blue-500 transition-all duration-500">
                Descubre algo nuevo
              </span>
            </h2>

            <div id="lineaGradiente" className="h-1 w-full mb-6 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />


            {/* Carrusel de líneas */}
<div className="relative w-full">
  {/* Botón Izquierda */}
  <button
    onClick={() => scroll("left")}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 dark:bg-gray-700/70 p-3 rounded-full shadow hover:scale-110 transition"
  >
    <ChevronLeft className="w-4 h-4" />
  </button>

  {/* Contenedor Scroll */}
  <div
    ref={scrollRef}
    className="flex gap-3 overflow-x-auto px-16 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
    {/* Botón fijo Todos */}
    <button
      key="todos"
      onClick={() => {
        setLineaSeleccionada(null);
        setPaginaActual(1);
      }}
      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-emerald-200 hover:to-green-300 hover:text-gray-800 shadow-sm origin-center
        ${
          lineaSeleccionada === null
            ? "ring-2 ring-[#5a5f58]"
            : modoOscuro
            ? "bg-[#0e1626] border border-white/10 text-gray-200"
            : "bg-gray-100 border border-gray-200 text-gray-700"
        }`}
    >
      <FaGlobe className="text-sm" />
      <span className="font-medium">Todos</span>
    </button>

    {/* Botones dinámicos */}
    {lineas.map((linea, index) => {
      const iconos = [
        <FaBriefcase key="brief" />, // Negocios
        <FaGraduationCap key="grad" />, // Educación
        <FaTools key="tools" />, // Mecánica / Técnicos
        <FaCertificate key="cert" />, // Certificaciones
        <FaUserGraduate key="prac" />, // Prácticas
        <FaPlane key="plane" />, // Turismo / Internacional
        <FaMobileAlt key="mobile" />, // Tecnología móvil
        <FaStethoscope key="health" />, // Medicina / Salud
        <FaLaptopCode key="dev" />, // Programación / TI
        <FaGavel key="law" />, // Derecho
        <FaBalanceScale key="justice" />, // Justicia
        <FaChalkboardTeacher key="teacher" />, // Docencia
        <FaHardHat key="engineer" />, // Ingeniería / Construcción
        <FaPaintBrush key="art" />, // Arte / Diseño
        <FaTractor key="agri" />, // Agricultura
      ];
      const colores = [
       "hover:from-blue-200 hover:to-blue-400",
  "hover:from-green-200 hover:to-green-400",
  "hover:from-purple-200 hover:to-purple-400",
  "hover:from-yellow-200 hover:to-yellow-400",
  "hover:from-pink-200 hover:to-pink-400",
  "hover:from-red-200 hover:to-red-400",
  "hover:from-indigo-200 hover:to-indigo-400",
  "hover:from-teal-200 hover:to-teal-400",
  "hover:from-cyan-200 hover:to-cyan-400",
  "hover:from-orange-200 hover:to-orange-400",
  "hover:from-lime-200 hover:to-lime-400",
  "hover:from-rose-200 hover:to-rose-400",
  "hover:from-amber-200 hover:to-amber-400",
  "hover:from-fuchsia-200 hover:to-fuchsia-400",
  "hover:from-emerald-200 hover:to-emerald-400",
  "hover:from-sky-200 hover:to-sky-400",
  "hover:from-violet-200 hover:to-violet-400",
  "hover:from-stone-200 hover:to-stone-400",
  "hover:from-gray-200 hover:to-gray-400",
  "hover:from-slate-200 hover:to-slate-400",
      ];
      const icono = iconos[index % iconos.length];
      const colorHover = colores[index % colores.length];

      return (
        <button
          key={linea.id}
          onClick={() => {
            setLineaSeleccionada(linea.id);
            setPaginaActual(1);
          }}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:text-gray-800 shadow-sm hover:bg-gradient-to-r origin-center
            ${colorHover}
            ${
              lineaSeleccionada === linea.id
                ? "ring-2 ring-[#39A900]"
                : modoOscuro
                ? "bg-[#0e1626] border border-white/10 text-gray-200"
                : "bg-gray-100 border border-gray-200 text-gray-700"
            }`}
        >
          {icono}
          <span className="font-medium">{linea.name}</span>
        </button>
      );
    })}
  </div>

  {/* Botón Derecha */}
  <button
    onClick={() => scroll("right")}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/60 dark:bg-gray-700/70 p-3 rounded-full shadow hover:scale-110 transition"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
</div>

          </section>

          <section className="mt-10 space-y-8">
            {/* Mostrar mensaje si no hay convocatorias */}
            {convocatoriasFiltradas.length === 0 && (
              <p className={`text-center text-lg font-semibold ${styles.text}`}>No hay resultados para esta línea.</p>
            )}
          </section>

          <section className="mt-10 space-y-8">
            {/*--------------------- Tarjeta destacada ----------------------- */}
            {convocatoriasPagina.length > 0 && (
              <div
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col ${styles.card}`}
              >
                {/* Etiqueta destacada */}
                <span
                  className={`absolute top-1 right-3 text-xs px-2 py-1 rounded-full font-bold z-10 flex items-center gap-1 shadow-md ${styles.badge}`}
                >
                  <MdWorkspacePremium className="text-black text-sm -mt-0.5" />
                  Destacada
                </span>

                {/* Contenedor flex 50/50 */}
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Imagen */}
                  <div className="w-full md:w-1/2 h-[300px] md:h-[370px] flex">
                    <img
                      onClick={() => {
                        setConvocatoriaSeleccionada(convocatoriasPagina[0]);
                        setModalAbierto(true);
                      }}
                      src={convocatoriasPagina[0].imageUrl || "/img/default.jpg"}
                      alt={convocatoriasPagina[0].title}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="w-full md:w-1/2 p-4 md:p-5 flex flex-col">
                    <div className="flex-grow space-y-3">
                      {/* 🔹 Título con ícono azul/blanco */}
                      <h3
                        className={`text-lg md:text-xl font-bold flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"
                          }`}
                      >
                        <FaMobileAlt
                          className={modoOscuro ? "text-white" : "text-[#00324D]"}
                        />
                        {convocatoriasPagina[0].title}
                      </h3>

                      {/* 🔹 Descripción con ícono */}
                      <div className="flex items-start gap-2">
                        <FaGraduationCap
                          className={`text-xl flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        />
                        <div className={`text-sm leading-snug space-y-1 ${styles.textMuted}`}>
                          {convocatoriasPagina[0].description
                            ?.split("\n")
                            .filter((p) => p.trim() !== "")
                            .map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                        </div>
                      </div>

                      {/* 🔹 Fechas con íconos */}
                      <div
                        className={`flex flex-col sm:flex-row gap-x-4 gap-y-1 pt-2 text-xs ${styles.textMuted}`}
                      >
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            size={14}
                          />
                          <span>
                            <strong>Apertura:</strong>{" "}
                            {new Date(
                              convocatoriasPagina[0].openDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarTimes
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            size={14}
                          />
                          <span>
                            <strong>Cierre:</strong>{" "}
                            {new Date(
                              convocatoriasPagina[0].closeDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ✅ Botones se dejan con sus estilos originales */}
                    <div
                      className={`mt-3 pt-3 flex items-center gap-2 flex-wrap ${styles.divider} border-t`}
                    >
                      <button
                        onClick={() => {
                          setConvocatoriaSeleccionada(convocatoriasPagina[0]);
                          setModalAbierto(true);
                        }}
                        className={`flex items-center gap-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${styles.primaryButton}`}
                      >
                        <FaRegFileAlt />
                        Detalles
                      </button>

                      <button
                        className={`flex items-center gap-1 px-4 py-2 rounded-md font-semibold text-sm transition-all ${styles.successButton}`}
                      >
                        <FaCheckCircle />
                        Inscribirse
                      </button>

                      <button
                        onClick={handleFavorito}
                        className="group ml-auto p-1.5 rounded-md hover:bg-white/5 transition-colors"
                        title="Marcar como favorita"
                      >
                        {destacado ? (
                          <FaStar className="text-yellow-400 text-xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                        ) : (
                          <FaRegStar
                            className={`text-xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            <ModalConvocatoria
              modalAbierto={modalAbierto}
              cerrarModal={() => setModalAbierto(false)}
              convocatoria={convocatoriaSeleccionada}
            />

            {/* ------------------- 3 tarjetas dinámicas ------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {convocatoriasPagina.slice(1, 4).map((convocatoria, index) => {
                const cardIndex = index + 1;
                const isExpandida = expandida === cardIndex; // controla expansión por tarjeta

                return (
                  <div
                    key={convocatoria.id || cardIndex}
                    className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
                  >
                    {/* Imagen */}
                    <div className="overflow-hidden">
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(convocatoria);
                          setModalAbierto(true);
                        }}
                        src={convocatoria.imageUrl || "/img/default.jpg"}
                        alt={convocatoria.title}
                        className="w-full h-[230px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        {/* 🔹 Título con ícono */}
                        <h4
                          className={`font-bold text-lg mb-3 flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        >
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          {convocatoria.title}
                        </h4>

                        {/* 🔹 Descripción con ícono */}
                        <div
                          className={`mb-2 flex items-start gap-3 ${styles.textMuted}`}
                        >
                          <FaGraduationCap
                            className={`text-2xl mt-0.5 flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />
                          <span className="text-sm relative">
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                {/* Botón para cerrar */}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 text-sm font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{convocatoria.description}</span>
                                {/* 3 punticos (...) clickeables */}
                                {convocatoria.description?.length > 100 && (
                                  <button
                                    onClick={() => setExpandida(cardIndex)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l  dark:from-[#1a0526] px-1"
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {/* 🔹 Fechas con íconos */}
                        <div
                          className={`flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mb-4 ${styles.textMuted}`}
                        >
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <strong>Apertura:</strong>{" "}
                            {new Date(convocatoria.openDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <strong>Cierre:</strong>{" "}
                            {new Date(convocatoria.closeDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Botones */}
                      <div
                        className={`pt-4 mt-auto flex items-center gap-2 border-t ${styles.divider}`}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(convocatoria);
                            setModalAbierto(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.successButton}`}
                        >
                          <FaCheckCircle /> Inscribirse
                        </button>
                        <button
                          onClick={handleFavorito}
                          className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {destacado ? (
                            <FaStar className="text-yellow-400 text-2xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                          ) : (
                            <FaRegStar
                              className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* ------------------- 4 tarjetas dinámicas ------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
              {convocatoriasPagina.slice(4, 8).map((convocatoria, index) => {
                const cardIndex = index + 4; // offset para diferenciar las tarjetas
                const isExpandida = expandida === cardIndex;

                return (
                  <div
                    key={convocatoria.id || index}
                    className={`rounded-lg overflow-hidden border transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col ${styles.card}`}
                  >
                    {/* Imagen */}
                    <div className="w-full h-[240px] overflow-hidden">
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(convocatoria);
                          setModalAbierto(true);
                        }}
                        src={convocatoria.imageUrl || "/img/default.jpg"}
                        alt={convocatoria.title}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex-grow">
                        {/* 🔹 Título con ícono */}
                        <h4
                          className={`font-bold text-lg flex items-center gap-2 mb-3 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        >
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          {convocatoria.title}
                        </h4>

                        {/* 🔹 Descripción con ícono */}
                        <div
                          className={`text-sm flex items-start gap-3 mb-2 ${styles.textMuted}`}
                        >
                          <FaGraduationCap
                            className={`text-xl mt-0.5 flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />

                          {/* Texto con truncado/expandido */}
                          <span className="text-sm relative">
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                {/* Botón para cerrar */}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{convocatoria.description}</span>
                                {/* 3 punticos clickeables */}
                                {convocatoria.description?.length > 100 && (
                                  <button
                                    onClick={() => setExpandida(cardIndex)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#1a0526] px-1"
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {/* 🔹 Fechas con íconos */}
                        <div
                          className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${styles.textMuted}`}
                        >
                          <p className="flex items-center gap-2">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <strong>Apertura:</strong>{" "}
                            {new Date(convocatoria.openDate).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <strong>Cierre:</strong>{" "}
                            {new Date(convocatoria.closeDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Botones */}
                      <div
                        className={`pt-4 mt-4 flex items-center gap-2 border-t ${styles.divider}`}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(convocatoria);
                            setModalAbierto(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${styles.successButton}`}
                        >
                          <FaCheckCircle /> Inscribirse
                        </button>
                        <button
                          onClick={handleFavorito}
                          className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {destacado ? (
                            <FaStar className="text-yellow-400 text-2xl transition-all group-hover:scale-125 group-hover:rotate-[360deg]" />
                          ) : (
                            <FaRegStar
                              className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>



            {/* ------------------- Mosaico de 4 tarjetas ------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[2800px] mx-auto my-8 px-0">
              {convocatoriasPagina.slice(8, 12).map((convocatoria, index) => {
                const cardIndex = index + 8;
                const isExpandida = expandida === cardIndex;

                return (
                  <div
                    key={convocatoria.id || index}
                    className={`rounded-xl overflow-hidden border transition-all hover:shadow-2xl hover:scale-105 flex flex-col h-full min-h-[320px] ${styles.card}`}
                  >
                    {/* Imagen */}
                    <div className="w-full h-[140px] sm:h-[160px] md:h-[180px] overflow-hidden">
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(convocatoria);
                          setModalAbierto(true);
                        }}
                        src={convocatoria.imageUrl || "/img/default.jpg"}
                        alt={convocatoria.title}
                        className="w-full h-full object-cover object-[20%] cursor-pointer transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow space-y-2">
                        {/* 🔹 Título */}
                        <h4
                          className={`text-base font-semibold flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"
                            }`}
                        >
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          />
                          {convocatoria.title}
                        </h4>

                        {/* 🔹 Descripción con truncado/expandido */}
                        <div
                          className={`text-sm flex items-start gap-2 mb-2 ${styles.textMuted}`}
                        >
                          <FaGraduationCap
                            className={`mt-0.5 flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                          />

                          <span className="text-sm relative">
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 text-xs font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">
                                  {convocatoria.description}
                                </span>
                                {convocatoria.description?.length > 120 && (
                                  <button
                                    onClick={() => setExpandida(cardIndex)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#1a0526] px-1"
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {/* 🔹 Fechas */}
                        <div
                          className={`mt-3 flex items-center justify-between text-xs ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                            } p-2 rounded`}
                        >
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <span>
                              {new Date(convocatoria.openDate).toLocaleDateString()}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            />
                            <span>
                              {new Date(convocatoria.closeDate).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Botones */}
                      <div
                        className={`mt-3 pt-3 flex items-center gap-2 border-t ${styles.divider}`}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(convocatoria);
                            setModalAbierto(true);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt size={12} /> Detalles
                        </button>

                        <button
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs ${styles.successButton}`}
                        >
                          <FaCheckCircle size={12} /> Inscribirse
                        </button>

                        <button
                          onClick={handleFavorito}
                          className="group ml-auto p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {destacado ? (
                            <FaStar className="text-yellow-400 text-2xl transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-[360deg]" />
                          ) : (
                            <FaRegStar
                              className={`text-2xl transition-all group-hover:text-yellow-400 group-hover:scale-125 group-hover:rotate-[360deg] ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>



            {/* ------------------- Paginación ------------------- */}
            <div className="flex justify-center items-center gap-3 mt-4 flex-wrap">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                <ChevronLeft size={18} /> Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`flex items-center justify-center w-11 h-11 font-bold rounded-xl transition-all ${paginaActual === num ? styles.primaryButton : styles.button}`}
                  onClick={() => setPaginaActual(num)}
                >
                  {num}
                </button>
              ))}

              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </main>
      </div>

      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
