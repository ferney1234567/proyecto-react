'use client';

import { useEffect, useState } from 'react';
import {
  FaFileAlt, FaCheckCircle, FaTimes, FaSearch, FaFilter,
  FaHourglassHalf, FaList, FaMoon, FaSun
} from 'react-icons/fa';
import { ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';
import Swal from "sweetalert2";
import { useTheme } from '../ThemeContext';
import { getThemeStyles } from '../themeStyles';

interface Categoria { id: number; name: string; }
interface Grupo { id: number; name: string; categoryId: number; }
interface Requisito {
  id: number;
  name: string;
  groupId: number;
  completo?: boolean;
  checkId?: number;
  userName?: string | null;
}

export default function GestionRequisitos() {
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  const [usuario, setUsuario] = useState<any>(null);
  const [empresa, setEmpresa] = useState<any>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [requisitos, setRequisitos] = useState<Requisito[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState<Record<number, boolean>>({});
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'completados' | 'pendientes'>('todos');

  // === ZOOM ===
  const [mostrarZoom, setMostrarZoom] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);
  const aumentarTexto = () => setFontSize((prev) => prev + 2);
  const disminuirTexto = () => setFontSize((prev) => Math.max(10, prev - 2));
  const resetTexto = () => setFontSize(16);

  // === Helper ===
  const getEntityId = (entidad: any) =>
    entidad?.id ?? entidad?.userId ?? entidad?.uid ?? entidad?.uId ?? null;

  // === Cargar usuario y empresa ===
  useEffect(() => {
    const u = localStorage.getItem('usuario');
    if (u) setUsuario(JSON.parse(u));
    const e = localStorage.getItem('empresa');
    if (e) setEmpresa(JSON.parse(e));
  }, []);

  // === Cargar datos ===
  useEffect(() => {
    const entidad = empresa || usuario;
    if (!entidad) return;

    const fetchData = async () => {
      try {
        const uid = getEntityId(entidad);
        if (!uid) return;

        const [catsRes, groupsRes, reqsRes, checksRes] = await Promise.all([
          fetch("http://localhost:4000/api/v1/requirementCategories").then(r => r.json()),
          fetch("http://localhost:4000/api/v1/requirementGroups").then(r => r.json()),
          fetch("http://localhost:4000/api/v1/requirements").then(r => r.json()),
          fetch("http://localhost:4000/api/v1/requirementChecks").then(r => r.json())
        ]);

        const checks = (checksRes.data || []).filter((c: any) =>
          empresa
            ? Number(c.companyId) === Number(uid)
            : Number(c.userId ?? c.user?.id) === Number(uid)
        );

        // Recuperar copia local
        const localBackup = localStorage.getItem(`requisitos_${uid}`);
        let localChecks: Record<number, boolean> = {};
        if (localBackup) localChecks = JSON.parse(localBackup);

        setRequisitos((reqsRes.data || []).map((r: Requisito) => {
          const check = checks.find((c: any) => c.requirementId === r.id);
          const estado =
            localChecks[r.id] !== undefined
              ? localChecks[r.id]
              : (check ? (check.isChecked ?? check.is_checked) : false);

          return {
            ...r,
            completo: estado,
            checkId: check ? check.id : undefined,
            userName: check?.company?.name || check?.user?.name || null,
          };
        }));

        setCategorias(catsRes.data || []);
        setGrupos(groupsRes.data || []);
        if (catsRes.data?.length) setCategoriaActiva(catsRes.data[0].id);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      }
    };
    fetchData();
  }, [empresa, usuario]);

  // === Progreso ===
  const gruposCategoria = grupos.filter(g => g.categoryId === categoriaActiva);
  const requisitosCategoria = requisitos.filter(r => gruposCategoria.some(g => g.id === r.groupId));
  const totalRequisitos = requisitosCategoria.length;
  const completados = requisitosCategoria.filter(r => r.completo).length;
  const progreso = totalRequisitos ? Math.round((completados / totalRequisitos) * 100) : 0;

  // === Acordeón ===
  const toggleAcordeon = (groupId: number) =>
    setAcordeonesAbiertos(prev => ({ ...prev, [groupId]: !prev[groupId] }));

  // === Marcar requisito ===
  const toggleCheck = (reqId: number) => {
    setRequisitos(prev => {
      const entidad = empresa || usuario;
      const nombre = entidad?.name || entidad?.legalName || entidad?.nombre;
      const updated = prev.map(r =>
        r.id === reqId ? { ...r, completo: !r.completo, userName: nombre } : r
      );

      const uid = getEntityId(entidad);
      if (uid) {
        const backup: Record<number, boolean> = {};
        updated.forEach(r => { backup[r.id] = !!r.completo; });
        localStorage.setItem(`requisitos_${uid}`, JSON.stringify(backup));
      }

      return updated;
    });
  };

  // === Guardar cambios ===
  const guardarCambios = async () => {
    const entidad = empresa || usuario;
    if (!entidad) return;

    try {
      const uid = getEntityId(entidad);
      const nombre = entidad?.name || entidad?.legalName || entidad?.nombre;

      for (const req of requisitos) {
        if (req.checkId) {
          await fetch(`http://localhost:4000/api/v1/requirementChecks/${req.checkId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requirementId: req.id,
              isChecked: req.completo,
              ...(empresa
                ? { companyId: uid, companyName: nombre }
                : { userId: uid, userName: nombre })
            })
          });
        } else {
          const res = await fetch("http://localhost:4000/api/v1/requirementChecks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requirementId: req.id,
              isChecked: req.completo,
              ...(empresa
                ? { companyId: uid, companyName: nombre }
                : { userId: uid, userName: nombre })
            })
          });
          const data = await res.json();
          setRequisitos(prev => prev.map(r =>
            r.id === req.id ? { ...r, checkId: data?.data?.id } : r
          ));
        }
      }

      Swal.fire({
        icon: "success",
        title: "¡Cambios guardados!",
        text: "Los requisitos se guardaron correctamente.",
        confirmButtonColor: "#00324D"
      });
    } catch (err) {
      Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
    }
  };

  const filtrarRequisitos = (items: Requisito[]) =>
    items.filter(item =>
      item.name.toLowerCase().includes(busqueda.toLowerCase()) &&
      (filtroEstado === 'todos' ||
        (filtroEstado === 'completados' && item.completo) ||
        (filtroEstado === 'pendientes' && !item.completo))
    );

  return (
    <div
      className={`min-h-screen ${styles.fondo} transition-colors duration-500`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className={`max-w-6xl mx-auto p-8 rounded-xl shadow-2xl space-y-8 border ${styles.divider} ${styles.card}`}>

        {/* 🔹 Botones flotantes (modo oscuro + zoom) */}
        <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
          {/* Modo oscuro */}
          <button
            onClick={toggleModoOscuro}
            className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            title="Cambiar modo"
          >
            {modoOscuro ? <FaSun /> : <FaMoon />}
          </button>

          {/* Zoom */}
          <button
            onClick={toggleZoomMenu}
            className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            title="Opciones de texto"
          >
            <ZoomIn />
          </button>

          {mostrarZoom && (
            <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
              <button
                onClick={aumentarTexto}
                className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                title="Aumentar texto"
              >
                <ZoomIn />
              </button>

              <button
                onClick={resetTexto}
                className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                title="Restablecer tamaño"
              >
                <RefreshCcw />
              </button>

              <button
                onClick={disminuirTexto}
                className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                  ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                title="Disminuir texto"
              >
                <ZoomOut />
              </button>
            </div>
          )}
        </div>

        {/* === ENCABEZADO === */}
        <div className={`relative -mx-8 -mt-8 px-8 py-6 ${modoOscuro
          ? 'bg-gradient-to-r from-[#0b1220] to-[#0a0f1a]'
          : 'bg-gradient-to-r from-[#00324D] to-[#005b8c]'
          } text-white rounded-t-xl`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaFileAlt size={28} />
              <div>
                <h1 className="text-2xl font-bold">Gestión de Requisitos</h1>
                <p className="text-white/80 text-sm">Los requisitos se guardan y gestionan por empresa registrada.</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#ffffff40" strokeWidth="3" strokeDasharray="100, 100" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${progreso}, 100`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {progreso}%
                </div>
              </div>
              <span className="text-white/80 text-sm mt-1">Completado</span>
            </div>
          </div>
        </div>

        {/* === CATEGORÍAS === */}
        <div className={`flex gap-1 p-1 rounded-lg ${modoOscuro ? 'bg-white/5' : 'bg-gray-100'}`}>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-6 py-3 text-sm font-semibold rounded-md flex-1 ${categoriaActiva === cat.id
                ? `${modoOscuro ? 'bg-white/10 text-white' : 'bg-white text-[#00324D]'}`
                : `${modoOscuro ? 'text-white/70' : 'text-gray-500'}`
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* === BUSCADOR === */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className={`flex items-center rounded-lg px-4 py-2 w-full md:w-1/2 ${styles.input}`}>
            <FaSearch className="mr-3" />
            <input
              type="text"
              placeholder="Buscar requisitos..."
              className="w-full bg-transparent outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`flex items-center gap-2 text-sm px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${modoOscuro
              ? 'bg-[#1e293b] hover:bg-[#334155] text-white'
              : 'bg-[#00324D] hover:bg-[#005b8c] text-white'}`}
          >
            <FaFilter /> Filtros
          </button>
        </div>

        {/* === FILTROS === */}
        {mostrarFiltros && (
          <div className="p-6 rounded-2xl space-y-4 shadow-sm border">
            <h4 className="font-semibold flex items-center gap-2"><FaFilter /> Estado</h4>
            <div className="flex gap-4">
              {[{ value: 'todos', label: 'Todos', icon: <FaList /> },
              { value: 'completados', label: 'Completados', icon: <FaCheckCircle /> },
              { value: 'pendientes', label: 'Pendientes', icon: <FaHourglassHalf /> }].map(estado => (
                <button
                  key={estado.value}
                  onClick={() => setFiltroEstado(estado.value as any)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ${filtroEstado === estado.value
                    ? (modoOscuro ? 'bg-[#005b8c] text-white' : 'bg-[#00324D] text-white')
                    : (modoOscuro ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                >
                  {estado.icon} {estado.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* === LISTADO === */}
        <div className="space-y-4">
          {gruposCategoria.map(grupo => {
            const items = filtrarRequisitos(requisitos.filter(r => r.groupId === grupo.id));
            return (
              <div key={grupo.id} className={`rounded-xl border transition-colors duration-300 ${modoOscuro ? 'bg-[#121826] border-gray-700' : 'bg-white border-gray-200'}`}>
                <button
                  onClick={() => toggleAcordeon(grupo.id)}
                  className={`w-full px-5 py-4 flex justify-between items-center font-semibold rounded-t-xl transition-colors ${modoOscuro
                    ? 'bg-[#1e293b] text-white hover:bg-[#334155]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>{grupo.name}</span>
                  <span>{acordeonesAbiertos[grupo.id] ? '▲' : '▼'}</span>
                </button>
                {acordeonesAbiertos[grupo.id] && (
                  <div className="animate-fadeIn">
                    {items.map(item => (
                      <div key={item.id} className={`px-5 py-3 flex items-center border-t ${modoOscuro ? 'border-gray-700' : 'border-gray-200'}`}>
                        <label className="flex items-center gap-3 w-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!item.completo}
                            onChange={() => toggleCheck(item.id)}
                          />
                          <span className={`${item.completo ? 'line-through text-gray-400' : ''}`}>
                            {item.name}
                          </span>
                          {item.userName && (
                            <span className="ml-2 text-xs text-gray-500">
                              (marcado por {item.userName})
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* === BOTONES === */}
        <div className="flex justify-end gap-3 pt-4">
          <a
            href="/usuario/perfilUser"
            className={`px-6 py-3 text-lg rounded-full flex items-center gap-2 font-semibold transition-all duration-300 ${modoOscuro
              ? 'bg-gray-600 hover:bg-gray-500 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
          >
            <FaTimes /> Cancelar
          </a>
          <button
            onClick={guardarCambios}
            className={`px-6 py-3 text-lg rounded-full flex items-center gap-2 font-semibold transition-all duration-300 ${modoOscuro
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-[#00324D] hover:bg-[#005b8c] text-white'}`}
          >
            <FaCheckCircle /> Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}
