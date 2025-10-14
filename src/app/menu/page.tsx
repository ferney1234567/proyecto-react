
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
  FaTractor,
  FaUserShield
} from 'react-icons/fa';
import { MdAccessibility, MdWorkspacePremium } from 'react-icons/md';
import Link from "next/link";
import Carousel from "../../components/carrucel/Carousel";
import ModalConvocatoria from '../../components/detalleConvo/detalleConvo';
import { Accessibility, ChevronLeft, ChevronRight, Moon, RefreshCcw, Sun, ZoomIn, ZoomOut } from 'lucide-react';
import { getConvocatorias } from "../api/convocatorias/routes";
import { getLineas } from "../api/linea/routes";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { getFavoritos, createFavorito, deleteFavorito } from "../api/favoritos/routes";
import { useFontSize } from '../../../FontSizeContext';
// Tema
import { useTheme } from "../ThemeContext";
import { getThemeStyles } from "../themeStyles";
import React from 'react';
import { useRouter } from "next/navigation";
import { asignarImagenesPorDefecto } from "@/utils/asignarImagenesPorDefecto";
import 'animate.css';


// Tipado base
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

type Usuario = {
  id?: number | string;
  uId?: number | string;
  uid?: number | string;
  userId?: number | string;
  name?: string;
  email?: string;
} | null;

type Favorito = {
  id?: number;
  userId: number;
  callId: number;
  call?: any;
};

// Helpers de normalización (evita campos undefined)
const getUserId = (u: Usuario) => {
  if (!u) return null;
  const raw = (u as any).id ?? (u as any).uId ?? (u as any).uid ?? (u as any).userId;
  return raw != null ? Number(raw) : null;
};

const getConvocatoriaCallId = (c: Convocatoria | any) => {
  const raw = (c?.callId ?? c?.id);
  return raw != null ? Number(raw) : null;
};

const normalizeFav = (f: any): Favorito | null => {
  const userId = Number(f?.userId ?? f?.user_id ?? f?.user?.id ?? NaN);
  const callId = Number(f?.callId ?? f?.call_id ?? f?.call?.id ?? NaN);
  if (Number.isNaN(userId) || Number.isNaN(callId)) return null;
  return {
    id: f?.id ?? f?.favoriteId,
    userId,
    callId,
    call: f?.call ?? undefined,
  };
};


export default function HomePage() {

  const [mostrarZoom, setMostrarZoom] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;
  // Datos      
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [lineas, setLineas] = useState<{ id: number; name: string }[]>([]);


  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

  // ✅ Usamos el contexto global (no definas useState aquí)
  const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();


  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  // Filtros
  const [lineaSeleccionada, setLineaSeleccionada] = useState<number | null>(null);
  const convocatoriasFiltradas = lineaSeleccionada
    ? convocatorias.filter((c) => c.lineId === lineaSeleccionada)
    : convocatorias;

  const totalPaginas = Math.ceil(convocatoriasFiltradas.length / convocatoriasPorPagina);
  const indiceInicio = (paginaActual - 1) * convocatoriasPorPagina;
  const indiceFin = indiceInicio + convocatoriasPorPagina;
  const convocatoriasPagina = convocatoriasFiltradas.slice(indiceInicio, indiceFin);

  // UI
  const [modalAbierto, setModalAbierto] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);
  const [expandida, setExpandida] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);



  // Tema
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  // Usuario
  const [usuario, setUsuario] = useState<Usuario>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        setUsuario(null);
      }
    }
  }, []);


  const obtenerInicial = (nombre?: string) =>
    (nombre?.charAt(0)?.toUpperCase() || "?");

  useEffect(() => {
    (async () => {
      try {
        const data = await getConvocatorias();
        // ✅ Aplica la función global que ya evita repeticiones
        const listaConImagenes = asignarImagenesPorDefecto(data?.data || []);
        setConvocatorias(listaConImagenes);
      } catch (err) {
        console.error("❌ Error al cargar convocatorias:", err);
        Swal.fire("Error", "No se pudieron cargar las convocatorias.", "error");
      }
    })();
  }, []);





  useEffect(() => {
    (async () => {
      try {
        const res = await getLineas();
        setLineas(res?.data ?? res ?? []);
      } catch (err) {
        console.error("Error al cargar líneas", err);
      }
    })();
  }, []);

  // Efecto decorativo
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
      (linea as any).style.background = `linear-gradient(to right, ${c1}, ${c2}, ${c3}, ${c4})`;
    }
    const intervalo = setInterval(actualizarColores, 3000);
    return () => clearInterval(intervalo);
  }, []);


  // Favoritos
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  // Cargar favoritos del usuario logueado
  useEffect(() => {
    const uid = getUserId(usuario);
    if (!uid) return;
    (async () => {
      try {
        const data = await getFavoritos();
        const lista = (data?.data ?? data) as any[];
        const normalizados = Array.isArray(lista)
          ? lista.map(normalizeFav).filter(Boolean) as Favorito[]
          : [];
        const soloMios = normalizados.filter(f => f.userId === uid);
        setFavoritos(soloMios);
      } catch (err) {
        console.error("❌ Error cargando favoritos:", err);
      }
    })();
  }, [usuario]);

  const isFavByConv = (c: Convocatoria) => {
    const cid = getConvocatoriaCallId(c);
    return cid != null && favoritos.some(f => Number(f.callId) === Number(cid));
  };

const handleFavorito = async (convocatoria: Convocatoria) => {
  const uid = getUserId(usuario);
  const cid = getConvocatoriaCallId(convocatoria);

  if (!uid) {
    Swal.fire({
      title: "⚠️ Atención",
      text: "Debes iniciar sesión para guardar favoritos",
      icon: "warning",
      background: modoOscuro ? "#1a0526" : "#fff",
      color: modoOscuro ? "#fff" : "#333",
      confirmButtonColor: modoOscuro ? "#39A900" : "#2d8500",
    });
    return;
  }

  if (!cid) {
    Swal.fire("Error", "No se pudo identificar la convocatoria (callId).", "error");
    return;
  }

  try {
    const favoritoExistente = favoritos.find((f) => Number(f.callId) === Number(cid));

    // === 🗑️ Eliminar favorito ===
    if (favoritoExistente?.id) {
      await deleteFavorito(favoritoExistente.id);
      setFavoritos((prev) => prev.filter((f) => Number(f.callId) !== Number(cid)));

      Swal.fire({
        title: "Eliminado de favoritos",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div style="
              font-size:60px;
              color:#e63946;
              margin-bottom:10px;
              animation: pulse 1s ease-in-out infinite alternate;
            ">🗑️</div>
            <p style="font-size:17px;">Este elemento fue eliminado correctamente.</p>
            <button id="ok-btn" style="
              margin-top:12px;
              background-color:#e63946;
              color:#fff;
              border:none;
              border-radius:10px;
              padding:8px 18px;
              font-weight:bold;
              cursor:pointer;
            ">OK</button>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); opacity:0.9; }
              100% { transform: scale(1.1); opacity:1; }
            }
          </style>
        `,
        background: modoOscuro ? "#1a0526" : "#fff",
        color: modoOscuro ? "#fff" : "#333",
        showConfirmButton: false,
        width: 400,
        padding: "1.6em",
        didOpen: () => {
          const okBtn = document.getElementById("ok-btn");
          if (okBtn) okBtn.addEventListener("click", () => Swal.close());
        },
      });
    }

    // === ⭐ Agregar favorito ===
    else {
      const payload = { userId: uid, callId: cid };
      const nuevoFav = await createFavorito(payload);
      const creadoRaw = nuevoFav?.data ?? nuevoFav;
      const creado =
        normalizeFav(creadoRaw) ?? { userId: uid, callId: cid, id: creadoRaw?.id };

      setFavoritos((prev) => [...prev, creado]);

      // ✨ SweetAlert estilizado con estrella
      Swal.fire({
        title: "¡Agregado a Favoritos!",
        html: `
          <div style="display:flex; justify-content:center; align-items:center; flex-direction:column;">
            <div style="
              font-size:50px;
              color:${modoOscuro ? '#FFD700' : '#ffcc00'};
              animation: glow 1.4s ease-in-out infinite alternate;
              margin-bottom:6px;
            ">⭐</div>
            <p style="font-size:16px;">Esta convocatoria ha sido destacada.</p>
            <button id="ok-btn-add" style="
              margin-top:12px;
              background-color:${modoOscuro ? '#39A900' : '#2d8500'};
              color:#fff;
              border:none;
              border-radius:10px;
              padding:8px 18px;
              font-weight:bold;
              cursor:pointer;
            ">OK</button>
          </div>
          <style>
            @keyframes glow {
              0% { text-shadow: 0 0 8px ${modoOscuro ? '#FFD700' : '#ffcc00'}; transform: scale(1); }
              100% { text-shadow: 0 0 20px ${modoOscuro ? '#FFF176' : '#FFEB3B'}; transform: scale(1.15); }
            }
          </style>
        `,
        background: modoOscuro ? "#1a0526" : "#fff",
        color: modoOscuro ? "#fff" : "#333",
        showConfirmButton: false,
        width: 400,
        padding: "1.6em",
        didOpen: () => {
          const okBtn = document.getElementById("ok-btn-add");
          if (okBtn) okBtn.addEventListener("click", () => Swal.close());
        },
      });
    }
  } catch (err: any) {
    console.error("❌ Error al actualizar favoritos:", err);
    Swal.fire("Error", "No se pudo actualizar tus favoritos.", "error");
  }
};



  // Scroll del carrusel
  const scroll = (direccion: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direccion === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };




  return (
    <div className={`min-h-[100vh] transition-colors duration-500 ${styles.fondo}`} style={{ fontSize: `${fontSize}px` }}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl ${styles.card}`}>
        <header className="p-4">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
            {/* Logo izquierdo + buscador */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-start -mt-2">
                <img
                  src="/img/sena.png"
                  alt="Logo Izquierdo"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && busqueda.trim() !== "") {
                      router.push(`/public/explorar?search=${encodeURIComponent(busqueda)}`);
                    }
                  }}
                  placeholder="Buscar convocatorias, programas, becas..."
                  className={`pl-12 pr-6 py-2 rounded-full w-full focus:outline-none focus:ring-2 ${styles.input}`}
                />
                <FaSearch
                  className={`absolute left-4 top-3.5 ${styles.textMuted} cursor-pointer`}
                  onClick={() => {
                    if (busqueda.trim() !== "") {
                      router.push(`/public/explorar?search=${encodeURIComponent(busqueda)}`);
                    }
                  }}
                />
              </div>
            </div>

            {/* Logo derecho + nav + botones */}
            <div className="flex flex-col items-end space-y-3">
              {/* Logo derecho */}
              <div className="flex justify-end">
                <img
                  src="/img/logo.png"
                  alt="Logo Derecho"
                  className="h-14 w-auto object-contain"
                />
              </div>

              {/* Navegación */}
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

                {/* 👇 Botón solo para administradores */}
                {typeof window !== "undefined" &&
                  (localStorage.getItem("rol") === "admin" ||
                    localStorage.getItem("rol") === "administrador" ||
                    localStorage.getItem("rol") === "2") && (
                    <Link href="/admin/menuadmin" className={`flex items-center space-x-1 ${styles.nav}`}>
                      <FaUserShield className="text-sm" />
                      <span>Admin</span>
                    </Link>
                  )}

                <Link href="/usuario/perfilUser">
                  <div
                    onClick={() => {
                      if (usuario && (usuario as any)?.name) {
                        Swal.fire({
                          title: `👋 Bienvenido ${(usuario as any).name}`,
                          html: "<p style='margin-top:8px;font-size:14px;'>Este es tu perfil.<br/>Completa tus datos y conoce nuestra plataforma.</p>",
                          icon: "info",
                          position: "top-end",
                          toast: true,
                          showConfirmButton: false,
                          timer: 4000,
                          background: modoOscuro ? "#1f2937" : "#ffffff",
                          color: modoOscuro ? "#f3f4f6" : "#111827",
                        });
                      }
                      // Redirección al perfil
                      router.push("/usuario/perfilUser");
                    }}
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer
    ${modoOscuro ? "bg-gray-600 text-white" : "bg-[#8f928f] text-white"}`}
                  >
                    {obtenerInicial((usuario as any)?.name)}
                  </div>

                </Link>
              </nav>

              {/* Botones flotantes (modo oscuro + zoom) */}
              <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
                {/* Botón modo oscuro */}
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

                {/* Botón principal menú de zoom */}
                <button
                  onClick={toggleZoomMenu}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  title="Opciones de texto"
                >
                  <MdAccessibility className="h-6 w-6" />
                </button>


                {/* Botones secundarios (se muestran solo si mostrarZoom = true) */}
                {mostrarZoom && (
                  <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
                    {/* Botón agrandar texto */}
                    <button
                      onClick={aumentarTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                        ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                        }`}
                      title="Aumentar texto"
                    >
                      <ZoomIn className="h-6 w-6" />
                    </button>

                    {/* Botón reset texto */}
                    <button
                      onClick={resetTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                        ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                        }`}
                      title="Restablecer tamaño"
                    >
                      <RefreshCcw className="h-6 w-6" />
                    </button>

                    {/* Botón disminuir texto */}
                    <button
                      onClick={disminuirTexto}
                      className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                        ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                        }`}
                      title="Disminuir texto"
                    >
                      <ZoomOut className="h-6 w-6" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </header>


        <main className="p-4">
          <div className="mb-8"><Carousel /></div>

          <section
            className="group"
            style={{ fontSize: `${fontSize}px` }}
          >
            <h2
              className={`text-3xl font-bold mt-8 mb-2 flex items-center gap-2 ${styles.text}`}
              style={{ fontSize: "1.4em" }}
            >
              <span className="group-hover:rotate-6 transition-transform duration-500 text-emerald-400">
                <FaSearchLocation style={{ fontSize: "1.1em" }} />
              </span>
              <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-blue-500 transition-all duration-500">
                Descubre algo nuevo
              </span>
            </h2>

            <div
              id="lineaGradiente"
              className="h-1 w-full mb-6 rounded-full animate-[pulse_3s_ease-in-out_infinite]"
            />

            <div className="relative w-full py-0">
              {/* 🔹 Botón scroll izquierda */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-gray-700/60 p-2 rounded-full shadow-sm hover:scale-110 transition
                 hover:bg-white/80 dark:hover:bg-gray-600/70"
                style={{ fontSize: "0.9em" }}
              >
                <ChevronLeft className="text-gray-700 dark:text-gray-300" style={{ fontSize: "1em" }} />
              </button>

              {/* 🔹 Lista de filtros */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto px-16 scroll-smooth [scrollbar-width:none] 
                 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden 
                 h-[65px] items-center"
              >
                {/* 🔹 Botón “Todos” */}
                <button
                  key="todos"
                  onClick={() => {
                    setLineaSeleccionada(null);
                    setPaginaActual(1);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-sm origin-center
        ${lineaSeleccionada === null ? "ring-2 ring-[#39A900]" : ""}
        ${modoOscuro
                      ? "bg-[#0e1626] border border-white/10 text-gray-200 hover:bg-[#1a2335] hover:text-emerald-300"
                      : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-200 hover:text-gray-900"
                    }`}
                  style={{ fontSize: "0.95em" }}
                >
                  <FaGlobe style={{ fontSize: "1em" }} />
                  <span className="font-medium">Todos</span>
                </button>

                {/* 🔹 Botones dinámicos */}
                {lineas.map((linea, index) => {
                  const iconos = [
                    <FaBriefcase key="brief" />,
                    <FaGraduationCap key="grad" />,
                    <FaTools key="tools" />,
                    <FaCertificate key="cert" />,
                    <FaUserGraduate key="prac" />,
                    <FaPlane key="plane" />,
                    <FaMobileAlt key="mobile" />,
                    <FaStethoscope key="health" />,
                    <FaLaptopCode key="dev" />,
                    <FaGavel key="law" />,
                    <FaBalanceScale key="justice" />,
                    <FaChalkboardTeacher key="teacher" />,
                    <FaHardHat key="engineer" />,
                    <FaPaintBrush key="art" />,
                    <FaTractor key="agri" />,
                  ];

                  // 🔹 Colores más suaves y controlados (sin brillos intensos)
                  const coloresSuaves = [
                    "hover:from-blue-100 hover:to-blue-200",
                    "hover:from-green-100 hover:to-green-200",
                    "hover:from-purple-100 hover:to-purple-200",
                    "hover:from-yellow-100 hover:to-yellow-200",
                    "hover:from-pink-100 hover:to-pink-200",
                    "hover:from-red-100 hover:to-red-200",
                    "hover:from-indigo-100 hover:to-indigo-200",
                    "hover:from-teal-100 hover:to-teal-200",
                    "hover:from-cyan-100 hover:to-cyan-200",
                    "hover:from-orange-100 hover:to-orange-200",
                    "hover:from-lime-100 hover:to-lime-200",
                    "hover:from-rose-100 hover:to-rose-200",
                    "hover:from-amber-100 hover:to-amber-200",
                    "hover:from-fuchsia-100 hover:to-fuchsia-200",
                    "hover:from-emerald-100 hover:to-emerald-200",
                    "hover:from-sky-100 hover:to-sky-200",
                    "hover:from-violet-100 hover:to-violet-200",
                    "hover:from-stone-100 hover:to-stone-200",
                    "hover:from-gray-100 hover:to-gray-200",
                    "hover:from-slate-100 hover:to-slate-200",
                  ];

                  const icono = iconos[index % iconos.length];
                  const colorHover = coloresSuaves[index % coloresSuaves.length];

                  return (
                    <button
                      key={linea.id}
                      onClick={() => {
                        setLineaSeleccionada(linea.id);
                        setPaginaActual(1);
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-sm hover:bg-gradient-to-r origin-center
            ${colorHover}
            ${lineaSeleccionada === linea.id ? "ring-2 ring-[#39A900]" : ""}
            ${modoOscuro
                          ? "bg-[#0e1626] border border-white/10 text-gray-200 hover:bg-[#1a2335] hover:text-emerald-300"
                          : "bg-gray-100 border border-gray-200 text-gray-700"
                        }`}
                      style={{
                        fontSize: "0.95em",
                        transition: "background-color 0.3s ease, color 0.3s ease",
                      }}
                    >
                      {React.cloneElement(icono, { style: { fontSize: "1em" } })}
                      <span className="font-medium">{linea.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 🔹 Botón scroll derecha */}
              <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-gray-700/60 p-2 rounded-full shadow-sm hover:scale-110 transition
                 hover:bg-white/80 dark:hover:bg-gray-600/70"
                style={{ fontSize: "0.9em" }}
              >
                <ChevronRight className="text-gray-700 dark:text-gray-300" style={{ fontSize: "1em" }} />
              </button>
            </div>
          </section>


          <section className="mt-10 space-y-8">
            {convocatoriasFiltradas.length === 0 && (
              <p className={`text-center text-lg font-semibold ${styles.text}`}>No hay resultados para esta línea.</p>
            )}
          </section>

          <section className="mt-10 space-y-8">
            {/* Tarjeta destacada */}
            {/* 🔹 Tarjeta destacada adaptable con descripción limitada */}
            {convocatoriasPagina.length > 0 && (
              <div
                className={`relative rounded-xl overflow-hidden transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2 flex flex-col md:flex-row ${styles.card}`}
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                {/* 🔹 Imagen adaptable */}
                <div
                  className="w-full md:w-1/2 relative overflow-hidden bg-gray-200 flex-shrink-0 flex self-stretch"
                  style={{
                    height: "auto",
                    minHeight: `${200 + (fontSize - 16) * 1.2}px`,
                    transition: "all 0.4s ease",
                    maxHeight: "400px",
                  }}
                >
                  <img
                    onClick={() => {
                      setConvocatoriaSeleccionada(convocatoriasPagina[0]);
                      setModalAbierto(true);
                    }}
                    src={convocatoriasPagina[0].imageUrl || "/img/default.jpg"}
                    alt={convocatoriasPagina[0].title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 cursor-pointer"
                    style={{
                      aspectRatio: "16/9",
                      maxHeight: "100%",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* 🔹 Contenido textual adaptable */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between relative">
                  {/* 🔸 Etiqueta */}
                  <span
                    className={`absolute top-4 right-6 px-3 py-1.5 rounded-full font-bold z-10 flex items-center gap-1 shadow-md ${styles.badge}`}
                    style={{
                      fontSize: `${0.85 + (fontSize - 16) * 0.03}em`,
                      backgroundColor: "#facc15",
                      color: "#1f2937",
                    }}
                  >
                    <MdWorkspacePremium
                      className="text-yellow-700"
                      style={{ fontSize: `${1.1 + (fontSize - 16) * 0.03}em` }}
                    />
                    Destacada
                  </span>

                  <div className="space-y-3 mt-8 flex-grow">
                    {/* 🔹 Título */}
                  {/* 🔹 Título (alineado con icono + máximo 2 líneas) */}
<h3
  className={`font-bold leading-tight flex items-start gap-2 ${
    modoOscuro ? "text-white" : "text-[#00324D]"
  }`}
  style={{
    fontSize: `${1.2 + (fontSize - 16) * 0.05}em`,
    lineHeight: "1.3em",
  }}
>
  {/* Icono perfectamente alineado */}
  <FaMobileAlt
    className={`${modoOscuro ? "text-white" : "text-[#00324D]"} flex-shrink-0 mt-[2px]`}
    style={{
      fontSize: `${1 + (fontSize - 16) * 0.05}em`,
    }}
  />

  {/* Título truncado con 2 líneas máximas */}
  <span
    className="block overflow-hidden text-ellipsis break-words"
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 2, // 🔹 Máximo 2 líneas
      WebkitBoxOrient: "vertical",
      textOverflow: "ellipsis",
      lineHeight: "1.3em",
      maxHeight: `${fontSize * 3.2}px`,
    }}
  >
    {convocatoriasPagina[0].title}
  </span>
</h3>


                    {/* 🔹 Descripción limitada a 4 párrafos */}
                    <div className="flex items-start gap-2">
                      <FaGraduationCap
                        className={`flex-shrink-0 mt-1 ${modoOscuro ? "text-white" : "text-[#00324D]"
                          }`}
                        style={{ fontSize: `${1 + (fontSize - 16) * 0.04}em` }}
                      />
                      <div
                        className={`leading-snug ${styles.textMuted} relative overflow-hidden`}
                        style={{
                          fontSize: `${0.95 + (fontSize - 16) * 0.03}em`,
                          display: "-webkit-box",
                          WebkitLineClamp: 4, // 🔹 Solo muestra 4 párrafos o líneas principales
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: `${fontSize * 7.5}px`,
                          lineHeight: "1.5em",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {convocatoriasPagina[0].description || "Sin descripción disponible."}
                      </div>
                    </div>

                    {/* 🔹 Fechas */}
                    <div
                      className={`flex flex-wrap gap-x-5 gap-y-2 pt-1 ${styles.textMuted}`}
                      style={{
                        fontSize: `${0.9 + (fontSize - 16) * 0.03}em`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt
                          className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          style={{ fontSize: "1em" }}
                        />
                        <span>
                          <strong>Apertura:</strong>{" "}
                          {new Date(convocatoriasPagina[0].openDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarTimes
                          className={modoOscuro ? "text-white" : "text-[#00324D]"}
                          style={{ fontSize: "1em" }}
                        />
                        <span>
                          <strong>Cierre:</strong>{" "}
                          {new Date(convocatoriasPagina[0].closeDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🔹 Botones adaptables */}
                  <div
                    className={`mt-5 pt-3 flex items-center gap-3 flex-wrap ${styles.divider} border-t`}
                    style={{
                      fontSize: `${0.95 + (fontSize - 16) * 0.03}em`,
                    }}
                  >
                    <button
                      onClick={() => {
                        setConvocatoriaSeleccionada(convocatoriasPagina[0]);
                        setModalAbierto(true);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${styles.primaryButton}`}
                    >
                      <FaRegFileAlt /> Detalles
                    </button>

                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${styles.successButton}`}
                    >
                      <FaCheckCircle /> Inscribirse
                    </button>

                    {/* ⭐ Favorito */}
                    <button
                      onClick={() => handleFavorito(convocatoriasPagina[0])}
                      className="group ml-auto relative p-2 rounded-md hover:bg-white/5 transition-all duration-300"
                      title="Marcar como favorita"
                    >
                      {/* 🌟 Estrella principal */}
                      {isFavByConv(convocatoriasPagina[0]) ? (
                        <FaStar
                          className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-[0_0_6px_#FFD700]"
                          style={{
                            fontSize: `${1.4 + (fontSize - 16) * 0.05}em`,
                          }}
                        />
                      ) : (
                        <FaRegStar
                          className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${modoOscuro ? "text-yellow-400" : "text-yellow-500"
                            } drop-shadow-[0_0_4px_#FFD700]`}
                          style={{
                            stroke: "#FFD700",
                            strokeWidth: "20",
                            fill: "transparent",
                            fontSize: `${1.4 + (fontSize - 16) * 0.05}em`,
                          }}
                        />
                      )}

                      {/* ✨ Estrellitas brillantes */}
                      <span
                        className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
                        style={{
                          fontSize: "0.7em",
                          filter: "drop-shadow(0 0 6px #FFD700)",
                        }}
                      >
                        ✦
                      </span>
                      <span
                        className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
                        style={{
                          fontSize: "0.6em",
                          filter: "drop-shadow(0 0 8px #FFFACD)",
                        }}
                      >
                        ✧
                      </span>
                      <span
                        className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
                        style={{
                          fontSize: "0.8em",
                          filter: "drop-shadow(0 0 10px #FFD700)",
                        }}
                      >
                        ✨
                      </span>
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            <ModalConvocatoria
              modalAbierto={modalAbierto}
              cerrarModal={() => setModalAbierto(false)}
              convocatoria={convocatoriaSeleccionada}
            />





            {/* 🔹 Cuadrícula de 3 tarjetas perfectamente alineadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {convocatoriasPagina.slice(1, 4).map((convocatoria, index) => {
                const isExpandida = expandida === String(convocatoria.id ?? convocatoria.callId);
                return (
                  <div
                    key={(convocatoria.id ?? convocatoria.callId ?? index) as number}
                    className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {/* Imagen escalable */}
                    <div
                      className="overflow-hidden"
                      style={{
                        height: "14em",
                        maxHeight: "20em",
                      }}
                    >
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
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div className="flex-grow space-y-3">
                        {/* 🔹 Título con ícono alineado y altura uniforme */}
                        <div className="flex items-start gap-2 min-h-[3.5rem]">
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            style={{
                              fontSize: "1.1em",
                              flexShrink: 0,
                              marginTop: "0.15em",
                            }}
                          />
                          <h4
                            className={`font-bold leading-snug ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{
                              fontSize: "1.2em",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.3",
                            }}
                          >
                            {convocatoria.title}
                          </h4>
                        </div>

                        {/* Descripción */}
                        <div className={`flex items-start gap-3 ${styles.textMuted}`}>
                          <FaGraduationCap
                            className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{ fontSize: "1.1em" }}
                          />
                          <span
                            className="relative flex-grow"
                            style={{
                              fontSize: "0.95em",
                              lineHeight: "1.3",
                            }}
                          >
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  style={{ fontSize: "0.9em" }}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{convocatoria.description}</span>
                                {convocatoria.description?.length > 100 && (
                                  <button
                                    onClick={() =>
                                      setExpandida(String(convocatoria.id ?? convocatoria.callId))
                                    }
                                    className="absolute bottom-0 right-0 bg-gradient-to-l from-transparent dark:from-[#1a0526] px-1"
                                    style={{ fontSize: "1em" }}
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {/* 🔹 Fechas alineadas */}
                        <div
                          className={`flex items-center justify-between mt-3 ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                            } p-2 rounded`}
                          style={{ fontSize: "0.9em" }}
                        >
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.openDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.closeDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 🔹 Botones alineados */}
                      <div
                        className={`pt-4 mt-4 flex items-center gap-2 border-t ${styles.divider}`}
                        style={{ fontSize: "0.9em" }}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(convocatoria);
                            setModalAbierto(true);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>

                        <button
                          className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-md font-semibold ${styles.successButton}`}
                        >
                          <FaCheckCircle /> Inscribirse
                        </button>

                        {/* Favorito */}
                       {/* ⭐ Botón de favorito con brillo y estrellitas */}
<button
  onClick={() => handleFavorito(convocatoria)}
  className="group relative p-2 rounded-md hover:bg-white/5 transition-all duration-300"
  title="Marcar como favorita"
>
  {/* 🌟 Estrella principal */}
  {isFavByConv(convocatoria) ? (
    <FaStar
      className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-[0_0_6px_#FFD700]"
      style={{ fontSize: "1.5em" }}
    />
  ) : (
    <FaRegStar
      className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
        modoOscuro ? "text-yellow-400" : "text-yellow-500"
      } drop-shadow-[0_0_4px_#FFD700]`}
      style={{
        stroke: "#FFD700",
        strokeWidth: "20",
        fill: "transparent",
        fontSize: "1.5em",
      }}
    />
  )}

  {/* ✨ Mini estrellitas decorativas */}
  <span
    className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
    style={{
      fontSize: "0.7em",
      filter: "drop-shadow(0 0 6px #FFD700)",
    }}
  >
    ✦
  </span>
  <span
    className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
    style={{
      fontSize: "0.6em",
      filter: "drop-shadow(0 0 8px #FFFACD)",
    }}
  >
    ✧
  </span>
  <span
    className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
    style={{
      fontSize: "0.8em",
      filter: "drop-shadow(0 0 10px #FFD700)",
    }}
  >
    ✨
  </span>
</button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>



            {/* 🔹 Cuadrícula de 2 tarjetas perfectamente alineadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
              {convocatoriasPagina.slice(4, 8).map((convocatoria, index) => {
                const isExpandida = expandida === String(convocatoria.id ?? convocatoria.callId);
                return (
                  <div
                    key={(convocatoria.id ?? convocatoria.callId ?? index) as number}
                    className={`rounded-lg overflow-hidden border transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col ${styles.card}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {/* Imagen */}
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        height: "15em",
                        maxHeight: "22em",
                      }}
                    >
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
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="flex-grow space-y-3">
                        {/* 🔹 Título con ícono alineado y altura uniforme */}
                        <div
                          className="flex items-start gap-2 min-h-[3.5rem]" // 🔹 misma altura para todos los títulos
                        >
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            style={{
                              fontSize: "1.1em",
                              flexShrink: 0,
                              marginTop: "0.15em",
                            }}
                          />
                          <h4
                            className={`font-bold leading-snug ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{
                              fontSize: "1.2em",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.3",
                            }}
                          >
                            {convocatoria.title}
                          </h4>
                        </div>

                        {/* Descripción */}
                        <div className={`flex items-start gap-3 ${styles.textMuted}`}>
                          <FaGraduationCap
                            className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{ fontSize: "1.1em" }}
                          />
                          <span
                            className="relative flex-grow"
                            style={{
                              fontSize: "0.95em",
                              lineHeight: "1.3",
                            }}
                          >
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  style={{ fontSize: "0.9em" }}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{convocatoria.description}</span>
                                {convocatoria.description?.length > 100 && (
                                  <button
                                    onClick={() =>
                                      setExpandida(String(convocatoria.id ?? convocatoria.callId))
                                    }
                                    className="absolute bottom-0 right-0 bg-gradient-to-l from-transparent dark:from-[#1a0526] px-1"
                                    style={{ fontSize: "1em" }}
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {/* 🔹 Fechas alineadas */}
                        <div
                          className={`flex items-center justify-between mt-3 ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                            } p-2 rounded`}
                          style={{ fontSize: "0.9em" }}
                        >
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.openDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.closeDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 🔹 Botones alineados */}
                      <div
                        className={`pt-4 mt-4 flex items-center gap-2 border-t ${styles.divider}`}
                        style={{ fontSize: "0.9em" }}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(convocatoria);
                            setModalAbierto(true);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>

                        <button
                          className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-md font-semibold ${styles.successButton}`}
                        >
                          <FaCheckCircle /> Inscribirse
                        </button>

                        {/* Favorito */}
                        {/* ⭐ Botón de favorito con brillo y estrellitas animadas */}
<button
  onClick={() => handleFavorito(convocatoria)}
  className="group relative p-2 rounded-md hover:bg-white/5 transition-all duration-300"
  title="Marcar como favorita"
>
  {/* 🌟 Estrella principal */}
  {isFavByConv(convocatoria) ? (
    <FaStar
      className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-[0_0_6px_#FFD700]"
      style={{ fontSize: "1.5em" }}
    />
  ) : (
    <FaRegStar
      className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
        modoOscuro ? "text-yellow-400" : "text-yellow-500"
      } drop-shadow-[0_0_4px_#FFD700]`}
      style={{
        stroke: "#FFD700",
        strokeWidth: "20",
        fill: "transparent",
        fontSize: "1.5em",
      }}
    />
  )}

  {/* ✨ Miniestrellas brillantes */}
  <span
    className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
    style={{
      fontSize: "0.7em",
      filter: "drop-shadow(0 0 6px #FFD700)",
    }}
  >
    ✦
  </span>
  <span
    className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
    style={{
      fontSize: "0.6em",
      filter: "drop-shadow(0 0 8px #FFFACD)",
    }}
  >
    ✧
  </span>
  <span
    className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
    style={{
      fontSize: "0.8em",
      filter: "drop-shadow(0 0 10px #FFD700)",
    }}
  >
    ✨
  </span>
</button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


            {/* 🔹 Cuadrícula de 4 tarjetas perfectamente alineadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[2800px] mx-auto my-8 px-0">
              {convocatoriasPagina.slice(8, 12).map((convocatoria, index) => {
                const isExpandida = expandida === String(convocatoria.id ?? convocatoria.callId);
                return (
                  <div
                    key={(convocatoria.id ?? convocatoria.callId ?? index) as number}
                    className={`rounded-xl overflow-hidden border transition-all hover:shadow-2xl hover:scale-105 flex flex-col h-full min-h-[340px] ${styles.card}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {/* Imagen */}
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        height: "11.5em",
                        maxHeight: "17em",
                      }}
                    >
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(convocatoria);
                          setModalAbierto(true);
                        }}
                        src={convocatoria.imageUrl || "/img/default.jpg"}
                        alt={convocatoria.title}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div className="space-y-2 flex-grow">
                        {/* 🔹 Título (ícono perfectamente al lado del texto, máximo 2 líneas) */}
                        <div className="flex items-start gap-2">
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            style={{
                              fontSize: "1.05em",
                              flexShrink: 0,
                              marginTop: "0.15em", // 🔹 Alinea el ícono con el inicio del texto
                            }}
                          />
                          <h4
                            className={`font-semibold leading-snug ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{
                              fontSize: "1.1em",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.3",
                            }}
                          >
                            {convocatoria.title}
                          </h4>
                        </div>

                        {/* Descripción */}
                        <div className={`flex items-start gap-2 mb-2 ${styles.textMuted}`}>
                          <FaGraduationCap
                            className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{ fontSize: "1em" }}
                          />
                          <span
                            className="relative flex-grow"
                            style={{
                              fontSize: "0.9em",
                              lineHeight: "1.3",
                            }}
                          >
                            {isExpandida ? (
                              <>
                                {convocatoria.description}
                                <button
                                  onClick={() => setExpandida(null)}
                                  className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  style={{ fontSize: "0.8em" }}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{convocatoria.description}</span>
                                {convocatoria.description?.length > 120 && (
                                  <button
                                    onClick={() =>
                                      setExpandida(String(convocatoria.id ?? convocatoria.callId))
                                    }
                                    className="absolute bottom-0 right-0 bg-gradient-to-l from-transparent dark:from-[#1a0526] px-1"
                                    style={{ fontSize: "0.9em" }}
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* 🔹 Fechas y botones alineados */}
                      <div className="mt-auto">
                        <div
                          className={`flex items-center justify-between ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                            } p-2 rounded mb-3`}
                          style={{ fontSize: "0.85em" }}
                        >
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.openDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <FaClock
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              {new Date(convocatoria.closeDate).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Botones */}
                        <div
                          className={`flex items-center justify-between gap-2 border-t pt-3 ${styles.divider}`}
                          style={{ fontSize: "0.85em" }}
                        >
                          <button
                            onClick={() => {
                              setConvocatoriaSeleccionada(convocatoria);
                              setModalAbierto(true);
                            }}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${styles.primaryButton}`}
                          >
                            <FaRegFileAlt /> Detalles
                          </button>

                          <button
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${styles.successButton}`}
                          >
                            <FaCheckCircle /> Inscribirse
                          </button>

                          {/* ⭐ Botón de favorito con brillo y miniestrellas animadas */}
<button
  onClick={() => handleFavorito(convocatoria)}
  className="group relative p-2 rounded-md hover:bg-white/5 transition-all duration-300"
  title="Marcar como favorita"
>
  {/* 🌟 Estrella principal */}
  {isFavByConv(convocatoria) ? (
    <FaStar
      className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-[0_0_6px_#FFD700]"
      style={{ fontSize: "1.4em" }}
    />
  ) : (
    <FaRegStar
      className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
        modoOscuro ? "text-yellow-400" : "text-yellow-500"
      } drop-shadow-[0_0_4px_#FFD700]`}
      style={{
        stroke: "#FFD700",
        strokeWidth: "20",
        fill: "transparent",
        fontSize: "1.4em",
      }}
    />
  )}

  {/* ✨ Miniestrellas decorativas */}
  <span
    className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
    style={{
      fontSize: "0.65em",
      filter: "drop-shadow(0 0 6px #FFD700)",
    }}
  >
    ✦
  </span>
  <span
    className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
    style={{
      fontSize: "0.55em",
      filter: "drop-shadow(0 0 8px #FFFACD)",
    }}
  >
    ✧
  </span>
  <span
    className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
    style={{
      fontSize: "0.7em",
      filter: "drop-shadow(0 0 10px #FFD700)",
    }}
  >
    ✨
  </span>
</button>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>



            {/* Paginación */}
            <div
              className="flex justify-center items-center gap-3 mt-4 flex-wrap"
              style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
            >
              {/* Botón Anterior */}
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
                style={{ fontSize: "0.9em" }}
              >
                <ChevronLeft style={{ fontSize: "1.2em" }} /> Anterior
              </button>

              {/* Botones de página */}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`flex items-center justify-center font-bold rounded-xl transition-all ${paginaActual === num ? styles.primaryButton : styles.button
                    }`}
                  onClick={() => setPaginaActual(num)}
                  style={{
                    fontSize: "1em",
                    width: "2.4em",   // Escala proporcional al texto
                    height: "2.4em",
                  }}
                >
                  {num}
                </button>
              ))}

              {/* Botón Siguiente */}
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
                style={{ fontSize: "0.9em" }}
              >
                Siguiente <ChevronRight style={{ fontSize: "1.2em" }} />
              </button>
            </div>

          </section>
        </main>
      </div>

      {/* Modal global (solo uno) */}
      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
