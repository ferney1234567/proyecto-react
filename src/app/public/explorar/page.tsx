'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaTags, FaSearchLocation, FaRegBookmark, FaSearch, FaStar, FaRegStar,
  FaCheckCircle, FaCalendarAlt, FaCalendarTimes, FaMobileAlt, FaGraduationCap,
  FaClock, FaRegFileAlt, FaImage, FaInfoCircle, FaCog,
  FaUserShield
} from 'react-icons/fa';
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid, MapPin, Moon, RefreshCcw, Sun, View, ZoomIn, ZoomOut } from 'lucide-react';
import Swal from 'sweetalert2';

import ModalConvocatoria from '../../../components/detalleConvo/detalleConvo'; // ajusta si tu ruta real difiere
import { getConvocatorias } from '../../api/convocatorias/routes';
import { getFavoritos, createFavorito, deleteFavorito } from "../../api/favoritos/routes";


// Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';
import confetti from "canvas-confetti";
import { useSearchParams } from 'next/navigation';

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

export default function ExplorarPage() {
  // === Estados ===
  const [categorias, setCategorias] = useState<{ id: number; name: string; description: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | ''>('');

  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const convocatoriasPorPagina = 12;

   const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const convocatoriasFiltradas = useMemo(() => {
    let filtradas = convocatorias;

    if (categoriaSeleccionada) {
      filtradas = filtradas.filter((c) => c.lineId === categoriaSeleccionada);
    }

    if (search) {
      filtradas = filtradas.filter((c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }

    return filtradas;
  }, [convocatorias, categoriaSeleccionada, search]);

  const [mostrarZoom, setMostrarZoom] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

  const aumentarTexto = () => setFontSize((prev) => prev + 2);
  const disminuirTexto = () => setFontSize((prev) => Math.max(10, prev - 2));
  const resetTexto = () => setFontSize(16);
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


  // 👉 Función para obtener inicial
  const obtenerInicial = (nombre: string) => nombre.charAt(0).toUpperCase();


  // === Cargar categorías desde la API ===
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/v1/lines');
        const json = await res.json();
        setCategorias(json.data || []);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    })();
  }, []);

  // === Cargar convocatorias desde la API ===
  useEffect(() => {
    (async () => {
      try {
        const data = await getConvocatorias();
        setConvocatorias(data?.data || []);
      } catch (e) {
        console.error('Error al cargar convocatorias', e);
      }
    })();
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
    Swal.fire("⚠️ Atención", "Debes iniciar sesión para guardar favoritos", "warning");
    return;
  }
  if (!cid) {
    console.error("No se pudo determinar el callId de la convocatoria", convocatoria);
    Swal.fire("Error", "No se pudo identificar la convocatoria (callId).", "error");
    return;
  }

  try {
    const favoritoExistente = favoritos.find((f) => Number(f.callId) === Number(cid));

    if (favoritoExistente?.id) {
      // Eliminar
      await deleteFavorito(favoritoExistente.id);
      setFavoritos((prev) => prev.filter((f) => Number(f.callId) !== Number(cid)));

      Swal.fire({
        title: "Eliminado",
        text: "Este elemento fue eliminado de tus favoritos.",
        icon: "info",
        confirmButtonText: "OK",
      });

    } else {
      // Crear
      const payload = { userId: uid, callId: cid };
      const nuevoFav = await createFavorito(payload);
      const creadoRaw = (nuevoFav?.data ?? nuevoFav);
      const creado = normalizeFav(creadoRaw) ?? { userId: uid, callId: cid, id: creadoRaw?.id };

      setFavoritos((prev) => [...prev, creado]);

      Swal.fire({
        title: "Agregado",
        text: "Este elemento fue agregado a tus favoritos.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  } catch (err: any) {
    console.error("❌ Error al actualizar favoritos:", err);
    const msg = String(err?.message ?? "");
    if (msg.includes("Faltan campos obligatorios")) {
      Swal.fire("Error", "Faltan userId o callId en la petición. Revisa el usuario en localStorage y la convocatoria.", "error");
    } else {
      Swal.fire("Error", "No se pudo actualizar favoritos", "error");
    }
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
                <img src="/img/sena.png" alt="Logo Izquierdo" className="h-16 w-auto object-contain" />
              </div>
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
      localStorage.getItem("rol") === "2") && (
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
                  <ZoomIn className="h-6 w-6" />
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
  className={`rounded-2xl p-4 mb-6 border transition-colors duration-500 ${
    modoOscuro ? "bg-[#121a2b] border-white/10" : "bg-white/80 border-gray-200/80"
  }`}
  style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
>
  <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">
    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
      {/* Categoría */}
      <div className="flex flex-col">
        <label
          className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
          style={{ fontSize: "0.9em" }}
        >
          <LayoutGrid style={{ fontSize: "1.1em" }} /> Categoría
        </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(Number(e.target.value) || "")}
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

      {/* Ubicación */}
      <div className="flex flex-col">
        <label
          className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
          style={{ fontSize: "0.9em" }}
        >
          <MapPin style={{ fontSize: "1.1em" }} /> Ubicación
        </label>
        <select
          className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
          style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
        >
          <option>Todo el país</option>
          <option>Bogotá</option>
          <option>Medellín</option>
          <option>Cali</option>
          <option>Barranquilla</option>
        </select>
      </div>

      {/* Fecha */}
      <div className="flex flex-col">
        <label
          className={`flex items-center font-medium mb-2 gap-2 ${styles.textMuted}`}
          style={{ fontSize: "0.9em" }}
        >
          <Calendar style={{ fontSize: "1.1em" }} /> Fecha de inicio
        </label>
        <select
          className={`w-full appearance-none rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${styles.input}`}
          style={{ fontSize: "0.95em", padding: "0.8em 1em" }}
        >
          <option>Cualquier fecha</option>
          <option>Julio 2025</option>
          <option>Agosto 2025</option>
          <option>Septiembre 2025</option>
        </select>
      </div>

      {/* Visualización */}
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

       {/* VISTA TARJETA */}
{vista === "Tarjeta" && (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-0 mb-8"
    style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
  >
    {convocatoriasPagina.map((c, i) => {
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
              height: "13em",     // Escala relativa al texto
              maxHeight: "20em",  // Límite superior
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
            <div>
              {/* 🔹 Título */}
              <h4
                className={`font-bold mb-3 flex items-center gap-2 ${
                  modoOscuro ? "text-white" : "text-[#00324D]"
                }`}
                style={{ fontSize: "1.2em" }}
              >
                <FaMobileAlt
                  className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  style={{ fontSize: "1em" }}
                />
                {c.title}
              </h4>

              {/* 🔹 Descripción */}
              <div className={`mb-2 flex items-start gap-3 ${styles.textMuted}`}>
                <FaGraduationCap
                  className={`flex-shrink-0 ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
                  style={{ fontSize: "1.1em" }}
                />
                <span className="relative" style={{ fontSize: "0.95em" }}>
                  {isExpanded ? (
                    <>
                      {c.description}
                      <button
                        onClick={() => setExpandedKey(null)}
                        className={`ml-2 font-bold hover:scale-110 transition-transform ${
                          modoOscuro ? "text-white" : "text-[#00324D]"
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

              {/* 🔹 Fechas */}
              <div
                className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 ${styles.textMuted}`}
                style={{ fontSize: "0.9em" }}
              >
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  <strong>Apertura:</strong>{" "}
                  {c.openDate ? new Date(c.openDate).toLocaleDateString() : "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarTimes
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  <strong>Cierre:</strong>{" "}
                  {c.closeDate ? new Date(c.closeDate).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div
              className={`pt-4 mt-auto flex items-center gap-2 border-t ${styles.divider}`}
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${styles.successButton}`}
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
                    className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
                      modoOscuro ? "text-yellow-400" : "text-yellow-500"
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
  <div className="w-full" style={{ fontSize: `${fontSize}px` }}> {/* 🔹 Escala global */}
    <div className="flex flex-col gap-6">
      {convocatoriasPagina.map((c, i) => {
        const key = `list-${indiceInicio + i}`;
        const isExpanded = expandedKey === key;
        return (
          <div
            key={c.id ?? key}
            className={`relative flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 ${styles.card}`}
          >
            {/* Imagen escalable */}
            <div
              className="w-full md:w-[400px] flex-shrink-0 overflow-hidden"
              style={{
                height: "16em",     // Escala proporcional al texto
                maxHeight: "22em",  // Límite superior
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

            {/* Contenido */}
            <div className="flex flex-col flex-grow p-6">
              <div className="flex-grow">
                {/* 🔹 Título */}
                <h4
                  className={`font-bold flex items-center gap-3 ${
                    modoOscuro ? "text-white" : "text-[#00324D]"
                  }`}
                  style={{ fontSize: "1.3em" }}
                >
                  <FaMobileAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  {c.title}
                </h4>

                <div className="my-4 border-t border-gray-300/60 dark:border-white/20" />

                {/* 🔹 Descripción */}
                <div className={`flex items-start gap-3 ${styles.textMuted}`}>
                  <FaGraduationCap
                    className={`flex-shrink-0 mt-0.5 ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
                    style={{ fontSize: "1.1em" }}
                  />
                  <span className="relative" style={{ fontSize: "0.95em" }}>
                    {isExpanded ? (
                      <>
                        {c.description}
                        <button
                          onClick={() => setExpandedKey(null)}
                          className={`ml-2 font-bold hover:scale-110 transition-transform ${
                            modoOscuro ? "text-white" : "text-[#00324D]"
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
                        {c.description?.length > 120 && (
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

                {/* 🔹 Fechas */}
                <div
                  className={`flex flex-wrap gap-x-6 gap-y-2 ${styles.textMuted}`}
                  style={{ fontSize: "0.9em" }}
                >
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt
                      className={modoOscuro ? "text-white" : "text-[#00324D]"}
                      style={{ fontSize: "1em" }}
                    />
                    <strong>Apertura:</strong>{" "}
                    {c.openDate ? new Date(c.openDate).toLocaleDateString() : "—"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendarTimes
                      className={modoOscuro ? "text-white" : "text-[#00324D]"}
                      style={{ fontSize: "1em" }}
                    />
                    <strong>Cierre:</strong>{" "}
                    {c.closeDate ? new Date(c.closeDate).toLocaleDateString() : "—"}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div
                className={`flex flex-wrap items-center gap-3 pt-4 mt-auto border-t ${styles.divider}`}
                style={{ fontSize: "0.9em" }}
              >
                <button
                  onClick={() => {
                    setConvocatoriaSeleccionada(c);
                    setModalAbierto(true);
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold ${styles.primaryButton}`}
                >
                  <FaRegFileAlt /> Detalles
                </button>
                <button
                  className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold ${styles.successButton}`}
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
                      className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
                        modoOscuro ? "text-yellow-400" : "text-yellow-500"
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
          <th className="px-6 py-4 font-medium uppercase tracking-wider border w-[280px]" style={{ fontSize: "0.9em" }}>
            <span className="flex items-center gap-2">
              <FaImage /> Convocatoria
            </span>
          </th>
          <th className="px-6 py-4 font-medium uppercase tracking-wider border w-[400px]" style={{ fontSize: "0.9em" }}>
            <span className="flex items-center gap-2">
              <FaInfoCircle /> Descripción
            </span>
          </th>
          <th className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[150px]" style={{ fontSize: "0.9em" }}>
            <span className="flex items-center justify-center gap-2">
              <FaCalendarAlt /> Apertura
            </span>
          </th>
          <th className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[150px]" style={{ fontSize: "0.9em" }}>
            <span className="flex items-center justify-center gap-2">
              <FaCalendarTimes /> Cierre
            </span>
          </th>
          <th className="px-6 py-4 font-medium uppercase tracking-wider border text-center w-[220px]" style={{ fontSize: "0.9em" }}>
            <span className="flex items-center justify-center gap-2">
              <FaCog /> Acciones
            </span>
          </th>
        </tr>
      </thead>

      {/* 🔹 Cuerpo */}
      <tbody className={`${styles.textMuted}`}>
        {convocatoriasPagina.map((c, i) => {
          const key = `table-${i}`;
          const isExpanded = expandedKey === key;

          return (
            <tr
              key={c.id ?? key}
              className={`${modoOscuro ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}
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
                    style={{ fontSize: "1em" }}
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
                        className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
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
              <td className="px-6 py-4 align-middle border text-center" style={{ fontSize: "0.9em" }}>
                <span className="flex items-center justify-center gap-2">
                  <FaCalendarAlt className={modoOscuro ? "text-white" : "text-[#00324D]"} style={{ fontSize: "1em" }} />
                  {c.openDate ? new Date(c.openDate).toLocaleDateString() : "—"}
                </span>
              </td>

              {/* Cierre */}
              <td className="px-6 py-4 align-middle border text-center" style={{ fontSize: "0.9em" }}>
                <span className="flex items-center justify-center gap-2">
                  <FaCalendarTimes className={modoOscuro ? "text-white" : "text-[#00324D]"} style={{ fontSize: "1em" }} />
                  {c.closeDate ? new Date(c.closeDate).toLocaleDateString() : "—"}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-6 py-4 align-middle border">
                <div className="flex items-center justify-center gap-2" style={{ fontSize: "0.9em" }}>
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
                        className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
                          modoOscuro ? "text-yellow-400" : "text-yellow-500"
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
                    <span className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-ping" style={{ fontSize: "0.7em" }}>
                      ✦
                    </span>
                    <span className="absolute top-0 left-0 text-yellow-300 opacity-0 group-hover:opacity-100 animate-bounce" style={{ fontSize: "0.6em" }}>
                      ✧
                    </span>
                    <span className="absolute -bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 animate-pulse" style={{ fontSize: "0.7em" }}>
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



       {/* VISTA MOSAICO */}
{vista === "Mosaico" && (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[2300px] mx-auto my-8 px-0"
    style={{ fontSize: `${fontSize}px` }} // 🔹 Escala global
  >
    {convocatoriasPagina.map((c, i) => {
      const key = `mosaic-${indiceInicio + i}`;
      const isExpanded = expandedKey === key;
      return (
        <div
          key={c.id ?? key}
          className={`rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:scale-105 flex flex-col h-full min-h-[320px] ${styles.card}`}
        >
          {/* Imagen escalable */}
          <div
            className="w-full overflow-hidden"
            style={{
              height: "11em",     // Escala proporcional al texto
              maxHeight: "16em",  // Límite superior
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

          {/* Contenido */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              {/* Título */}
              <h4
                className={`font-semibold flex items-center gap-2 ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
                style={{ fontSize: "1.1em" }}
              >
                <FaMobileAlt
                  className={modoOscuro ? "text-white" : "text-[#00324D]"}
                  style={{ fontSize: "1em" }}
                />
                {c.title}
              </h4>

              {/* Descripción */}
              <div className="relative" style={{ fontSize: "0.95em" }}>
                {isExpanded ? (
                  <>
                    {c.description}
                    <button
                      onClick={() => setExpandedKey(null)}
                      className={`ml-2 font-bold hover:scale-110 transition-transform ${modoOscuro ? "text-white" : "text-[#00324D]"}`}
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
                        className="absolute bottom-0 right-0 bg-gradient-to-l dark:from-[#1a0526] px-1"
                        style={{ fontSize: "0.85em" }}
                        title="Mostrar más"
                      >
                        ...
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Fechas */}
              <div
                className={`mt-3 flex items-center justify-between rounded p-2 ${styles.textMuted} ${
                  modoOscuro ? "bg-white/5" : "bg-gray-50"
                }`}
                style={{ fontSize: "0.85em" }}
              >
                <span className="flex items-center gap-1">
                  <FaCalendarAlt
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  <span>{c.openDate ? new Date(c.openDate).toLocaleDateString() : "—"}</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaClock
                    className={modoOscuro ? "text-white" : "text-[#00324D]"}
                    style={{ fontSize: "1em" }}
                  />
                  <span>{c.closeDate ? new Date(c.closeDate).toLocaleDateString() : "—"}</span>
                </span>
              </div>
            </div>

            {/* Botones */}
            <div
              className={`mt-3 pt-3 flex items-center gap-2 border-t ${styles.divider}`}
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
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md ${styles.successButton}`}
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
                    className={`transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125 ${
                      modoOscuro ? "text-yellow-400" : "text-yellow-500"
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
      className={`flex items-center justify-center font-bold rounded-xl transition-all ${
        paginaActual === num ? styles.primaryButton : styles.button
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
