'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaClock, FaRegFileAlt, FaImage, FaInfoCircle, FaCog,
  FaUserShield,
  FaBriefcase
} from 'react-icons/fa';
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, MapPin, Moon, RefreshCcw, Sun, View, ZoomIn, ZoomOut } from 'lucide-react';
import Swal from 'sweetalert2';

import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo'; // ajusta si tu ruta real difiere
import { getConvocatorias } from '../../api/convocatorias/routes';
import { getFavoritos, createFavorito, deleteFavorito } from "../../api/favoritos/routes";
import { getUserInterestsByUserId } from "../../api/usuarioInteres/route";


import { useFontSize } from '../../../../FontSizeContext';
// Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';
import confetti from "canvas-confetti";
import { useSearchParams } from 'next/navigation';
import { asignarImagenesPorDefecto } from "@/utils/asignarImagenesPorDefecto";
import { MdAccessibility } from 'react-icons/md';
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

// ============================
// 🔹 Helpers
// ============================
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

export default function ExplorarPage() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const [busquedaLocal, setBusquedaLocal] = useState("");

  // === Estados ===
  const [categorias, setCategorias] = useState<{ id: number; name: string; description: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');

  // 🔹 Públicos objetivo
  const [publicosObjetivo, setPublicosObjetivo] = useState<{ id: number; name: string }[]>([]);
  const [publicoObjetivoSeleccionado, setPublicoObjetivoSeleccionado] = useState<number | ''>('');


  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;

  const [interesesUsuario, setInteresesUsuario] = useState<{ id: number; name: string }[]>([]);
  const [interesSeleccionado, setInteresSeleccionado] = useState<number | ''>('');


  // 🔹 Estados para filtrar por rango de fechas
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";


  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const convocatoriasFiltradas = useMemo(() => {
    let filtradas = convocatorias;

    // 🔹 Filtro por categoría
    if (categoriaSeleccionada) {
      filtradas = filtradas.filter((c) => c.lineId === categoriaSeleccionada);
    }

    // 🔹 Filtro por interés
    if (interesSeleccionado) {
      filtradas = filtradas.filter((c) => c.interestId === interesSeleccionado);
    }

    // 🔹 Filtro por público objetivo
    if (publicoObjetivoSeleccionado) {
      filtradas = filtradas.filter((c) => c.targetAudienceId === publicoObjetivoSeleccionado);
    }

    // ✅ 🔹 Filtro por búsqueda global (de URL) o local
    const termino = (busquedaLocal || search).toLowerCase().trim();
    if (termino) {
      filtradas = filtradas.filter(
        (c) =>
          c.title.toLowerCase().includes(termino) ||
          c.description.toLowerCase().includes(termino)
      );
    }

    // 🔹 Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      filtradas = filtradas.filter((c) => {
        const open = new Date(c.openDate);
        const start = fechaInicio ? new Date(fechaInicio) : null;
        const end = fechaFin ? new Date(fechaFin) : null;
        if (start && open < start) return false;
        if (end && open > end) return false;
        return true;
      });
    }

    // 🔹 Filtro por tipo de fecha
    if (fechaSeleccionada) {
      const hoy = new Date();
      filtradas = filtradas.filter((c) => {
        const apertura = new Date(c.openDate);
        const cierre = new Date(c.closeDate);
        if (fechaSeleccionada === "recientes") {
          const hace15Dias = new Date(hoy);
          hace15Dias.setDate(hoy.getDate() - 15);
          return apertura >= hace15Dias && apertura <= hoy;
        }
        if (fechaSeleccionada === "vencer") {
          const en7Dias = new Date(hoy);
          en7Dias.setDate(hoy.getDate() + 7);
          return cierre >= hoy && cierre <= en7Dias;
        }
        if (fechaSeleccionada === "proximas") {
          return apertura > hoy;
        }
        if (fechaSeleccionada === "finalizadas") {
          return cierre < hoy;
        }
        return true;
      });
    }

    return filtradas;
  }, [
    convocatorias,
    categoriaSeleccionada,
    interesSeleccionado,
    publicoObjetivoSeleccionado,
    busquedaLocal, // 🔹 Muy importante agregarlo aquí
    search,        // 🔹 Para que también funcione cuando se viene con ?search=
    fechaInicio,
    fechaFin,
    fechaSeleccionada,
  ]);





  const [mostrarZoom, setMostrarZoom] = useState(false);

  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);
  // ✅ Usamos el contexto global (no definas useState aquí)
  const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();

  // Datos
  // Estados UI
  const [vista, setVista] = useState<'Tarjeta' | 'Lista' | 'Tabla' | 'Mosaico'>('Tarjeta');
  const [modalAbierto, setModalAbierto] = useState(false);

  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Tema
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);


  // === Paginación con las filtradas ===
  const totalPaginas = useMemo(
    () => Math.max(1, Math.ceil(convocatoriasFiltradas.length / convocatoriasPorPagina)),
    [convocatoriasFiltradas.length]
  );

  const indiceInicio = (paginaActual - 1) * convocatoriasPorPagina;
  const indiceFin = indiceInicio + convocatoriasPorPagina;

  const convocatoriasPagina = useMemo(
    () => convocatoriasFiltradas.slice(indiceInicio, indiceFin),
    [convocatoriasFiltradas, indiceInicio, indiceFin]
  );

  // 👉 Estado del usuario logueado
  const [usuario, setUsuario] = useState<{ name: string } | null>(null);






  // 👉 Al cargar la página obtenemos el usuario del localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // 👉 Cargar favoritos al iniciar desde localStorage
  useEffect(() => {
    const guardados = localStorage.getItem("favoritos");
    if (guardados) {
      setFavoritos(JSON.parse(guardados));
    }
  }, []);

  // 👉 Cargar intereses del usuario logueado
  useEffect(() => {
    const uid = getUserId(usuario);
    if (!uid) return;

    (async () => {
      try {
        const data = await getUserInterestsByUserId(uid);
        setInteresesUsuario(data);
      } catch (err) {
        console.error("❌ Error cargando intereses del usuario:", err);
      }
    })();
  }, [usuario]);


  // === Cargar públicos objetivo desde la API ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/targetAudiences`);
        const json = await res.json();
        setPublicosObjetivo(json.data || []);
      } catch (err) {
        console.error('Error cargando públicos objetivo:', err);
      }
    })();
  }, [API_URL]);


  // 👉 Función para obtener inicial
  const obtenerInicial = (nombre: string) => nombre.charAt(0).toUpperCase();


  // === Cargar categorías desde la API ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/lines`);
        const json = await res.json();
        setCategorias(json.data || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    })();
  }, [API_URL]);

  // === Cargar convocatorias desde la API ===
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




  // Favoritos
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  // Cargar favoritos del usuario logueado
  // ============================
  // 🔹 Favoritos con JWT
  // ============================
  useEffect(() => {
    const uid = getUserId(usuario);
    if (!uid) return;
    (async () => {
      try {
        const data = await getFavoritos(); // ← este ya usa token internamente
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

  const registrarClickConvocatoria = async (callId: number | null) => {
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
  } catch {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/calls/${callId}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Error registrando click");
    }

    const data = await response.json();

    // 🔥 Actualizar contador en estado global
    setConvocatorias((prev) =>
      prev.map((c) => {
        const cid = c.callId || c.id;
        if (Number(cid) === Number(callId)) {
          return { ...c, clickCount: data.clickCount };
        }
        return c;
      })
    );

    // 🔥 Solo evitar doble clic inmediato, no bloquear el día
    const vistos = JSON.parse(localStorage.getItem("conv_clicks") || "[]");
    if (!vistos.includes(callId)) {
      vistos.push(callId);
      localStorage.setItem("conv_clicks", JSON.stringify(vistos));
    }
  } catch (error) {
    console.error("Error:", error);
  }
};







  return (
    <div className={`min-h-[100vh] transition-colors duration-500 ${styles.fondo}`} style={{ fontSize: `${fontSize}px` }}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl ${styles.card}`}>
        {/* HEADER */}
        <header className="p-4">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6">
            {/* Logo + buscador */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex justify-start -mt-2">
                <img
                  src="/img/Recurso1@4x.png"
                  alt="Logo Izquierdo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={busquedaLocal}
                  onChange={(e) => setBusquedaLocal(e.target.value)}
                  placeholder="Buscar convocatorias, programas, becas..."
                  className={`pl-12 pr-6 py-2 rounded-full w-full focus:outline-none focus:ring-2 ${styles.input}`}
                />
                <FaSearch className={`absolute left-4 top-3.5 ${styles.textMuted}`} />
              </div>

            </div>

            {/* Derecha: nav + modo oscuro */}
            <div className="flex flex-col items-end space-y-3">
              {/* Logo derecho */}
              <div className="flex justify-center items-center ">
                {modoOscuro ? (
                  <img
                    src="/img/logonoche.png"
                    alt="Logo Derecho"
                    className="h-20 w-auto object-contain mt-2"
                  />
                ) : (
                  <img
                    src="/img/logo.png"
                    alt="Logo Derecho"
                    className="h-16 w-auto object-contain mt-2"
                  />
                )}
                <img
                  src="/img/Recurso2@4x.png"
                  alt="Logo Derecho"
                  className="h-20 w-auto object-contain"
                />
              </div>

              <nav className="flex items-center space-x-6  pt-3">
                <Link href="/menu" className={`flex items-center space-x-1 ${styles.nav}`}>
                  <FaTags className="text-sm" />
                  <span>Descubrir</span>
                </Link>
                <Link href="/public/explorar/" className={`flex items-center space-x-1 ${styles.navActive}`}>
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
                    localStorage.getItem("rol") === "1") && (
                    <Link href="/admin/menuadmin" className={`flex items-center space-x-1 ${styles.nav}`}>
                      <FaUserShield className="text-sm" />
                      <span>Admin</span>
                    </Link>
                  )}

                {/* Avatar dinámico */}
                <Link href="/usuario/perfilUser">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-md 
                ${modoOscuro ? "bg-gray-600 text-white" : "bg-[#8f928f] text-white"}`}
                  >
                    {usuario ? obtenerInicial(usuario.name) : "?"}
                  </div>
                </Link>
              </nav>

              <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3">
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

        {/* FILTROS */}
        <section
          className={`rounded-2xl p-4 mb-6 border transition-colors duration-500 ${modoOscuro
            ? "bg-[#121a2b] border-white/10"
            : "bg-white/80 border-gray-200/80"
            }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">
            {/* 🔹 Grid con 5 columnas en pantallas grandes */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

              {/* 🟢 Categoría */}
              <div className="flex flex-col">
                <label
                  className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <LayoutGrid style={{ fontSize: "1.1em" }} /> Categoría
                </label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) =>
                    setCategoriaSeleccionada(Number(e.target.value) || "")
                  }
                  className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                  style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🟢 Intereses */}
              <div className="flex flex-col">
                <label
                  className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <FaTags style={{ fontSize: "1.1em" }} /> Intereses Usuario
                </label>
                <select
                  value={interesSeleccionado}
                  onChange={(e) =>
                    setInteresSeleccionado(Number(e.target.value) || "")
                  }
                  className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                  style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
                >
                  <option value="">Todos los intereses</option>
                  {interesesUsuario.map((interes) => (
                    <option key={interes.id} value={interes.id}>
                      {interes.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🟢 Público Objetivo */}
              <div className="flex flex-col">
                <label
                  className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <FaBriefcase style={{ fontSize: "1.1em" }} /> Público Objetivo
                </label>
                <select
                  value={publicoObjetivoSeleccionado}
                  onChange={(e) =>
                    setPublicoObjetivoSeleccionado(Number(e.target.value) || "")
                  }
                  className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                  style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
                >
                  <option value="">Todos los públicos</option>
                  {publicosObjetivo.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🟢 Fecha */}
              <div className="flex flex-col">
                <label
                  className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <Calendar style={{ fontSize: "1.1em" }} /> Filtrar por fecha
                </label>
                <select
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                  style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
                >
                  <option value="">Cualquier fecha</option>
                  <option value="recientes">Recientes (últimos 15 días)</option>
                  <option value="vencer">Próximas a vencer (menos de 7 días)</option>
                  <option value="proximas">Próximas convocatorias</option>
                  <option value="finalizadas">Finalizadas</option>
                </select>
              </div>

              {/* 🟢 Visualización */}
              <div className="flex flex-col">
                <label
                  className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <View style={{ fontSize: "1.1em" }} /> Visualización
                </label>
                <select
                  value={vista}
                  onChange={(e) => setVista(e.target.value as any)}
                  className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
                  style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
                >
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Lista">Lista</option>
                  <option value="Tabla">Tabla</option>
                  <option value="Mosaico">Mosaico</option>
                </select>
              </div>

            </div>
          </div>
        </section>


        {/* 🔹 VISTA TARJETA (alineada y con Apertura/Cierre) */}
        {vista === "Tarjeta" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 mb-8"
            style={{ fontSize: `${fontSize}px` }}
          >
            {convocatoriasPagina
              // ✅ Filtro por interés seleccionado
              .filter((c) => {
                if (!interesSeleccionado) return true;
                return c.interestId === interesSeleccionado;
              })
              .map((c, i) => {
                const key = `card-${indiceInicio + i}`;
                const isExpanded = expandedKey === key;
                return (
                  <div
                    key={c.id ?? key}
                    className={`rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col ${styles.card}`}
                  >
                    {/* Imagen escalable */}
                    <div
                      className="overflow-hidden"
                      style={{
                        height: "13em",
                        maxHeight: "20em",
                      }}
                    >
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(c);
                          setModalAbierto(true);
                        }}
                        src={c.imageUrl || "/img/default.jpg"}
                        alt={c.title}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div className="flex-grow space-y-3">
                        {/* 🔹 Título con ícono y altura fija */}
                        <div className="flex items-start gap-2 min-h-[3.5rem]">
                          <FaMobileAlt
                            className={modoOscuro ? "text-white" : "text-[#00324D]"}
                            style={{ fontSize: "1.1em", marginTop: "0.15em" }}
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
                            {c.title}
                          </h4>
                        </div>

                        {/* 🔹 Descripción */}
                        <div className={`flex items-start gap-3 ${styles.textMuted}`}>
                          <FaGraduationCap
                            className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{ fontSize: "1.1em" }}
                          />
                          <span
                            className="relative flex-grow"
                            style={{ fontSize: "0.95em", lineHeight: "1.3" }}
                          >
                            {isExpanded ? (
                              <>
                                {c.description}
                                <button
                                  onClick={() => setExpandedKey(null)}
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
                                <span className="line-clamp-3">{c.description}</span>
                                {c.description?.length > 100 && (
                                  <button
                                    onClick={() => setExpandedKey(key)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#1a0526] px-1"
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

                        {/* 🔹 Fechas alineadas (Apertura / Cierre) */}
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
                              <strong></strong>{" "}
                              {c.openDate
                                ? new Date(c.openDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              <strong></strong>{" "}
                              {c.closeDate
                                ? new Date(c.closeDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 🔹 Botones */}
                      <div
                        className={`pt-4 mt-4 flex items-center gap-2 border-t ${styles.divider}`}
                        style={{ fontSize: "0.9em" }}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(c);
                            setModalAbierto(true);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>

                        <button
                          onClick={() => {
                            const cid = getConvocatoriaCallId(c);

                            // 👇 SUMA AL CONTADOR EN EL BACKEND
                            registrarClickConvocatoria(cid);

                            // 👇 Abrir el enlace de inscripción
                            if (c.callLink) {
                              window.open(c.callLink, "_blank");
                            } else if (c.pageUrl) {
                              window.open(c.pageUrl, "_blank");
                            } else {
                              Swal.fire({
                                icon: "warning",
                                title: "⚠️ Enlace no disponible",
                                text: "Esta convocatoria no tiene un enlace de inscripción activo.",
                              });
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${styles.successButton}`}
                        >
                          <FaCheckCircle /> Inscribirse
                        </button>



                        {/* 🔹 Favorito con animaciones */}
                        <button
                          onClick={() => handleFavorito(c)}
                          className="group ml-auto relative p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {isFavByConv(c) ? (
                            <FaStar
                              className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                              style={{ fontSize: "1.5em" }}
                            />
                          ) : (
                            <FaRegStar
                              className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${modoOscuro
                                ? "text-yellow-400"
                                : "text-yellow-500"
                                }`}
                              style={{
                                stroke: "#FFD700",
                                strokeWidth: "20",
                                fill: "transparent",
                                fontSize: "1.5em",
                              }}
                            />
                          )}

                          {/* 🌟 Estrellitas */}
                          <span
                            className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
                            style={{ fontSize: "0.7em" }}
                          >
                            ✦
                          </span>
                          <span
                            className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
                            style={{ fontSize: "0.6em" }}
                          >
                            ✧
                          </span>
                          <span
                            className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
                            style={{ fontSize: "0.7em" }}
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
        )}




        {/* VISTA LISTA */}
        {vista === "Lista" && (
          <div className="w-full" style={{ fontSize: `${fontSize * 0.9}px` }}> {/* 🔹 escala global reducida */}
            <div className="flex flex-col gap-5">
              {convocatoriasPagina
                .filter((c) => {
                  if (!interesSeleccionado) return true;
                  return c.interestId === interesSeleccionado;
                })
                .map((c, i) => {
                  const key = `list-${indiceInicio + i}`;
                  const isExpanded = expandedKey === key;

                  return (
                    <div
                      key={c.id ?? key}
                      className={`relative flex flex-col md:flex-row rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${styles.card}`}
                      style={{
                        minHeight: `${12 + fontSize * 0.1}em`, // 🔹 más pequeño
                      }}
                    >
                      {/* Imagen ajustada al alto del contenedor */}
                      <div
                        className="flex-shrink-0 w-full md:w-[35%] relative"
                        style={{
                          height: "auto",
                          maxHeight: "16em",
                        }}
                      >
                        <img
                          onClick={() => {
                            setConvocatoriaSeleccionada(c);
                            setModalAbierto(true);
                          }}
                          src={c.imageUrl || "/img/default.jpg"}
                          alt={c.title}
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                          style={{
                            aspectRatio: "16 / 9",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      {/* Contenido */}
                      <div
                        className="flex flex-col flex-grow p-4 justify-between"
                        style={{
                          fontSize: `${fontSize * 0.9}px`,
                          lineHeight: "1.5",
                        }}
                      >
                        <div>
                          {/* 🔹 Título */}
                          <h4
                            className={`font-semibold flex items-start gap-2 mb-2 ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
                            style={{
                              fontSize: `${1.1 + fontSize * 0.015}em`,
                              lineHeight: "1.3em",
                            }}
                          >
                            <FaMobileAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{
                                fontSize: "0.9em",
                                flexShrink: 0,
                                marginTop: "0.2em",
                              }}
                            />
                            <span
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2, // 🔹 máximo 2 líneas
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: "1.3em",
                                maxHeight: "2.6em", // 🔹 evita que crezca más de 2 líneas
                              }}
                              title={c.title} // 🔹 muestra el título completo al pasar el mouse
                            >
                              {c.title}
                            </span>
                          </h4>


                          {/* Línea divisoria */}
                          <div className="my-2 border-t border-gray-300/40 dark:border-white/20" />

                          {/* 🔹 Descripción */}
                          <div className={`flex items-start gap-2 ${styles.textMuted}`}>
                            <FaGraduationCap
                              className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                              style={{ fontSize: "1em" }}
                            />
                            <span className="relative" style={{ fontSize: "0.9em" }}>
                              {isExpanded ? (
                                <>
                                  {c.description}
                                  <button
                                    onClick={() => setExpandedKey(null)}
                                    className={`ml-2 font-bold hover:scale-105 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                      }`}
                                    style={{ fontSize: "0.85em" }}
                                    title="Ver menos"
                                  >
                                    ▲
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="line-clamp-2">{c.description}</span>
                                  {c.description?.length > 100 && (
                                    <button
                                      onClick={() => setExpandedKey(key)}
                                      className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#1a0526] px-1"
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

                          {/* 🔹 Fechas */}
                          <div
                            className={`flex flex-wrap gap-x-5 gap-y-1 mt-3 ${styles.textMuted}`}
                            style={{ fontSize: "0.85em" }}
                          >
                            <span className="flex items-center gap-1.5">
                              <FaCalendarAlt
                                className={modoOscuro ? "text-white" : "text-[#00324D]"}
                                style={{ fontSize: "0.9em" }}
                              />
                              <strong>Apertura:</strong>{" "}
                              {c.openDate
                                ? new Date(c.openDate).toLocaleDateString()
                                : "—"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaCalendarTimes
                                className={modoOscuro ? "text-white" : "text-[#00324D]"}
                                style={{ fontSize: "0.9em" }}
                              />
                              <strong>Cierre:</strong>{" "}
                              {c.closeDate
                                ? new Date(c.closeDate).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>

                        {/* 🔹 Botones */}
                        <div
                          className={`flex flex-wrap items-center gap-2 pt-3 mt-4 border-t ${styles.divider}`}
                          style={{ fontSize: "0.85em" }}
                        >
                          <button
                            onClick={() => {
                              setConvocatoriaSeleccionada(c);
                              setModalAbierto(true);
                            }}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold ${styles.primaryButton}`}
                          >
                            <FaRegFileAlt /> Detalles
                          </button>
                          <button
                            onClick={() => {
                              const cid = getConvocatoriaCallId(c);
                              registrarClickConvocatoria(cid); // 👈 SUMA EL CONTADOR

                              // abrir enlaces
                              if (c.callLink) {
                                window.open(c.callLink, "_blank");
                              } else if (c.pageUrl) {
                                window.open(c.pageUrl, "_blank");
                              } else {
                                Swal.fire({
                                  icon: "warning",
                                  title: "⚠️ Enlace no disponible",
                                  text: "Esta convocatoria no tiene un enlace de inscripción activo.",
                                  confirmButtonColor: "#39A900",
                                  background: modoOscuro ? "#1a0526" : "#fff",
                                  color: modoOscuro ? "#fff" : "#333",
                                });
                              }
                            }}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold ${styles.successButton}`}
                          >
                            <FaCheckCircle /> Inscribirse
                          </button>


                          <button
                            onClick={() => handleFavorito(c)}
                            className="group ml-auto relative p-2 rounded-md hover:bg-white/5 transition-colors"
                            title="Marcar como favorita"
                          >
                            {isFavByConv(c) ? (
                              <FaStar
                                className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                                style={{ fontSize: "1.5em" }}
                              />
                            ) : (
                              <FaRegStar
                                className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${modoOscuro
                                  ? "text-yellow-400"
                                  : "text-yellow-500"
                                  }`}
                                style={{
                                  stroke: "#FFD700",
                                  strokeWidth: "20",
                                  fill: "transparent",
                                  fontSize: "1.5em",
                                }}
                              />
                            )}

                            {/* 🌟 Estrellitas */}
                            <span
                              className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
                              style={{ fontSize: "0.7em" }}
                            >
                              ✦
                            </span>
                            <span
                              className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
                              style={{ fontSize: "0.6em" }}
                            >
                              ✧
                            </span>
                            <span
                              className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
                              style={{ fontSize: "0.7em" }}
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
          </div>
        )}


        {/* VISTA TABLA */}
        {vista === "Tabla" && (
          <div
            className={`rounded-2xl shadow-lg mt-6 overflow-x-auto border ${styles.divider}`}
            style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
          >
            <table className="w-full text-left border-collapse min-w-[1200px]">
              {/* 🔹 Encabezado */}
              <thead
                className={`${modoOscuro ? "bg-[#0e1626]" : "bg-[#00324D]"} text-white`}
              >
                <tr>
                  <th
                    className="px-6 py-4 font-medium uppercase tracking-wider border w-[240px]"
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center gap-2">
                      <FaImage /> Convocatoria
                    </span>
                  </th>

                  <th
                    className="px-6 py-4 font-medium uppercase tracking-wider border w-[400px]"
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center gap-2">
                      <FaInfoCircle /> Descripción
                    </span>
                  </th>
                  <th
                    className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[150px]"
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendarAlt /> Apertura
                    </span>
                  </th>
                  <th
                    className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[150px]"
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendarTimes /> Cierre
                    </span>
                  </th>
                  <th
                    className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[220px]"
                    style={{ fontSize: "0.9em" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaCog /> Acciones
                    </span>
                  </th>
                </tr>
              </thead>

              {/* 🔹 Cuerpo */}
              <tbody className={`${styles.textMuted}`}>
                {convocatoriasPagina
                  // ✅ FILTRO por interés seleccionado
                  .filter((c) => {
                    if (!interesSeleccionado) return true;
                    return c.interestId === interesSeleccionado;
                  })
                  .map((c, i) => {
                    const key = `table-${i}`;
                    const isExpanded = expandedKey === key;

                    return (
                      <tr
                        key={c.id ?? key}
                        className={`${modoOscuro ? "hover:bg-white/5" : "hover:bg-gray-50"
                          } transition-colors`}
                      >
                        {/* Convocatoria + título */}
                        <td className="px-6 py-4 align-middle border">
                          <div className="flex items-center gap-4">
                            <div
                              className="rounded-md overflow-hidden flex-shrink-0"
                              style={{
                                width: "8.5em",
                                height: "5.5em",
                              }}
                            >
                              <img
                                onClick={() => {
                                  setConvocatoriaSeleccionada(c);
                                  setModalAbierto(true);
                                }}
                                src={c.imageUrl || "/img/default.jpg"}
                                alt={c.title}
                                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                            <span
                              className={`font-semibold ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
                              style={{
                                fontSize: "1em",
                                display: "-webkit-box",
                                WebkitLineClamp: 3, // 🔹 Máximo 3 líneas visibles
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: "1.3em",
                                maxHeight: "3.9em", // 🔹 Asegura que solo se muestren 3 líneas
                              }}
                              title={c.title} // 🔹 Muestra el texto completo al pasar el mouse
                            >
                              {c.title}
                            </span>

                          </div>
                        </td>



                        {/* Descripción */}
                        <td className="px-6 py-4 align-middle border">
                          <div className="relative" style={{ fontSize: "0.95em" }}>
                            {isExpanded ? (
                              <>
                                {c.description}
                                <button
                                  onClick={() => setExpandedKey(null)}
                                  className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"
                                    }`}
                                  style={{ fontSize: "0.85em" }}
                                  title="Ver menos"
                                >
                                  ▲
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="line-clamp-3">{c.description}</span>
                                {c.description?.length > 120 && (
                                  <button
                                    onClick={() => setExpandedKey(key)}
                                    className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#0e1626] px-1"
                                    style={{ fontSize: "0.85em" }}
                                    title="Mostrar más"
                                  >
                                    ...
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>

                        {/* Apertura */}
                        <td
                          className="px-6 py-4 align-middle border text-center"
                          style={{ fontSize: "0.9em" }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <FaCalendarAlt
                              className={
                                modoOscuro ? "text-white" : "text-[#00324D]"
                              }
                              style={{ fontSize: "1em" }}
                            />
                            {c.openDate
                              ? new Date(c.openDate).toLocaleDateString()
                              : "—"}
                          </span>
                        </td>

                        {/* Cierre */}
                        <td
                          className="px-6 py-4 align-middle border text-center"
                          style={{ fontSize: "0.9em" }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <FaCalendarTimes
                              className={
                                modoOscuro ? "text-white" : "text-[#00324D]"
                              }
                              style={{ fontSize: "1em" }}
                            />
                            {c.closeDate
                              ? new Date(c.closeDate).toLocaleDateString()
                              : "—"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 align-middle border">
                          <div
                            className="flex items-center justify-center gap-2"
                            style={{ fontSize: "0.9em" }}
                          >
                            <button
                              onClick={() => {
                                setConvocatoriaSeleccionada(c);
                                setModalAbierto(true);
                              }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${styles.primaryButton}`}
                            >
                              <FaRegFileAlt /> Detalles
                            </button>
                            <button
                              onClick={() => {
                                const cid = getConvocatoriaCallId(c);
                                registrarClickConvocatoria(cid);  // 👈 SUMA EL CONTADOR AQUÍ

                                if (c.callLink) {
                                  window.open(c.callLink, "_blank");
                                } else if (c.pageUrl) {
                                  window.open(c.pageUrl, "_blank");
                                } else {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "⚠️ Enlace no disponible",
                                    text: "Esta convocatoria no tiene un enlace de inscripción activo.",
                                    confirmButtonColor: "#39A900",
                                    background: modoOscuro ? "#1a0526" : "#fff",
                                    color: modoOscuro ? "#fff" : "#333",
                                  });
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${styles.successButton}`}
                            >
                              <FaCheckCircle /> Inscribirse
                            </button>


                            <button
                              onClick={() => handleFavorito(c)}
                              className="group ml-auto relative p-2 rounded-md hover:bg-white/5 transition-colors"
                              title="Marcar como favorita"
                            >
                              {isFavByConv(c) ? (
                                <FaStar
                                  className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                                  style={{ fontSize: "1.5em" }}
                                />
                              ) : (
                                <FaRegStar
                                  className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${modoOscuro
                                    ? "text-yellow-400"
                                    : "text-yellow-500"
                                    }`}
                                  style={{
                                    stroke: "#FFD700",
                                    strokeWidth: "20",
                                    fill: "transparent",
                                    fontSize: "1.5em",
                                  }}
                                />
                              )}

                              {/* 🌟 Estrellitas */}
                              <span
                                className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
                                style={{ fontSize: "0.7em" }}
                              >
                                ✦
                              </span>
                              <span
                                className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
                                style={{ fontSize: "0.6em" }}
                              >
                                ✧
                              </span>
                              <span
                                className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
                                style={{ fontSize: "0.7em" }}
                              >
                                ✨
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}


        {/* 🔹 VISTA MOSAICO (alineada, con puntos sin botón Ver más) */}
        {vista === "Mosaico" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[2300px] mx-auto my-8 px-0"
            style={{
              fontSize: `${fontSize}px`,
              gridAutoRows: "1fr",
            }}
          >
            {convocatoriasPagina
              .filter((c) => {
                if (!interesSeleccionado) return true;
                return c.interestId === interesSeleccionado;
              })
              .map((c, i) => {
                const key = `mosaic-${indiceInicio + i}`;

                return (
                  <div
                    key={c.id ?? key}
                    className={`rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02] flex flex-col h-full min-h-[420px] ${styles.card}`}
                  >
                    {/* 🖼 Imagen superior completamente adaptada */}
                    <div className="relative w-full h-[10em] overflow-hidden">
                      <img
                        onClick={() => {
                          setConvocatoriaSeleccionada(c);
                          setModalAbierto(true);
                        }}
                        src={c.imageUrl || "/img/default.jpg"}
                        alt={c.title}
                        className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    {/* 📄 Contenido */}
                    <div className="flex flex-col flex-grow p-4 justify-between">
                      <div className="flex-grow flex flex-col justify-between space-y-2">
                        {/* 🔹 Título con ícono alineado */}
                        <div className="flex items-start gap-2 min-h-[3rem]">
                          <FaMobileAlt
                            className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{ fontSize: "1em" }}
                          />
                          <h4
                            className={`font-semibold leading-snug ${modoOscuro ? "text-white" : "text-[#00324D]"
                              }`}
                            style={{
                              fontSize: "1.05em",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: "1.3",
                            }}
                          >
                            {c.title}
                          </h4>
                        </div>

                        {/* 🔹 Descripción truncada con puntos suspensivos */}
                        <div className={`relative ${styles.textMuted}`} style={{ fontSize: "0.9em" }}>
                          <div className="flex items-start gap-2">
                            <FaGraduationCap
                              className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"
                                }`}
                              style={{ fontSize: "1.1em" }}
                            />
                            <span
                              className="line-clamp-3"
                              style={{
                                flex: 1,
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: "1.4em",
                              }}
                            >
                              {c.description || "Sin descripción disponible."}
                            </span>
                          </div>
                        </div>

                        {/* 🔹 Fechas perfectamente alineadas */}
                        <div
                          className={`mt-2 flex items-center justify-between rounded-md p-2 ${styles.textMuted} ${modoOscuro ? "bg-white/5" : "bg-gray-50"
                            }`}
                          style={{
                            fontSize: "0.85em",
                            marginTop: "0.5em",
                          }}
                        >
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <FaCalendarAlt
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              <strong></strong>{" "}
                              {c.openDate
                                ? new Date(c.openDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <FaCalendarTimes
                              className={modoOscuro ? "text-white" : "text-[#00324D]"}
                              style={{ fontSize: "1em" }}
                            />
                            <span>
                              <strong></strong>{" "}
                              {c.closeDate
                                ? new Date(c.closeDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 🔹 Botones inferiores alineados */}
                      <div
                        className={`pt-3 mt-3 flex items-center gap-2 border-t ${styles.divider}`}
                        style={{ fontSize: "0.9em" }}
                      >
                        <button
                          onClick={() => {
                            setConvocatoriaSeleccionada(c);
                            setModalAbierto(true);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${styles.primaryButton}`}
                        >
                          <FaRegFileAlt /> Detalles
                        </button>

                      <button
  onClick={() => {
    const cid = getConvocatoriaCallId(c);
    
    // 👇 ESTA ES LA LÍNEA QUE FALTABA
    registrarClickConvocatoria(cid);

    if (c.callLink) {
      window.open(c.callLink, "_blank");
    } else if (c.pageUrl) {
      window.open(c.pageUrl, "_blank");
    } else {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Enlace no disponible",
        text: "Esta convocatoria no tiene un enlace de inscripción activo.",
        confirmButtonColor: "#39A900",
        background: modoOscuro ? "#1a0526" : "#fff",
        color: modoOscuro ? "#fff" : "#333",
      });
    }
  }}
  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${styles.successButton}`}
>
  <FaCheckCircle /> Inscribirse
</button>


                        {/* 🌟 Favorito con animación */}
                        <button
                          onClick={() => handleFavorito(c)}
                          className="group ml-auto relative p-2 rounded-md hover:bg-white/5 transition-colors"
                          title="Marcar como favorita"
                        >
                          {isFavByConv(c) ? (
                            <FaStar
                              className="text-yellow-400 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                              style={{ fontSize: "1.5em" }}
                            />
                          ) : (
                            <FaRegStar
                              className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${modoOscuro
                                ? "text-yellow-400"
                                : "text-yellow-500"
                                }`}
                              style={{
                                stroke: "#FFD700",
                                strokeWidth: "20",
                                fill: "transparent",
                                fontSize: "1.5em",
                              }}
                            />
                          )}

                          {/* 🌟 Estrellitas */}
                          <span
                            className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping"
                            style={{ fontSize: "0.7em" }}
                          >
                            ✦
                          </span>
                          <span
                            className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce"
                            style={{ fontSize: "0.6em" }}
                          >
                            ✧
                          </span>
                          <span
                            className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse"
                            style={{ fontSize: "0.7em" }}
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
        )}





        {/* PAGINACIÓN */}
        {/* PAGINACIÓN */}
        <div
          className="flex justify-center items-center gap-3 mt-8 flex-wrap"
          style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
        >
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{ fontSize: "0.95em" }}
          >
            <ChevronLeft style={{ fontSize: "1em" }} /> Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`flex items-center justify-center font-bold rounded-xl transition-all ${paginaActual === num ? styles.primaryButton : styles.button
                }`}
              onClick={() => setPaginaActual(num)}
              style={{
                width: "2.6em",
                height: "2.6em",
                fontSize: "1em",
              }}
            >
              {num}
            </button>
          ))}

          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 ${styles.button}`}
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
            style={{ fontSize: "0.95em" }}
          >
            Siguiente <ChevronRight style={{ fontSize: "1em" }} />
          </button>
        </div>

      </div>

      <ModalConvocatoria
        modalAbierto={modalAbierto}
        cerrarModal={() => setModalAbierto(false)}
        convocatoria={convocatoriaSeleccionada}
      />
    </div>
  );
}
