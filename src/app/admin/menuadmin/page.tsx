'use client';

import React, { useState, useEffect } from "react";
import {
  User, Users, FileText, Building, UserCog, CheckSquare, Tag, Megaphone, Briefcase, Globe2, MapPin,
  Landmark, Star, Search, Bell, Activity, TrendingUp,
} from "lucide-react";
import { FaCheckCircle, FaClipboardList, FaUserTag } from "react-icons/fa";
import Linea from "../linea/linea";
import PublicoObjetivo from "../publicoObjetivo/PublicoObjetivo";
import Requisitos from "../requisitos/Requisitos";
import EntidadInstitucion from "../entidadInstitucion/EntidadInstitucion";
import Rol from "../rol/rol";
import RequisitoSeleccion from "../requisitosSeleccion/RequisitoSeleccion";
import Tipo from "../tipo/Tipo";
import Convocatorias from "../convocatorias/convocatorias";
import Empresa from "../empresa/Empresa";
import Usuario from "../usuario/Usuario";
import Ciudad from "../cuidad/Cuidad";
import Departamento from "../departamento/Departamento";
import Interes from "../intereses/Intereses";
import Chequeo from "../checkeo/checkeo";
import Favorito from "../favoritos/favoritos";
import RequisitosCategoria from "../requisitosCategoria/requisitosCategoria";
import ConvocatoriaHistorial from "../convocatoriaHistorial/convocatoriaHistorial";
import UsuarioInteres from "../usuarioInteres/usuarioInteres";
import InteresAdicionalConvocatoria from "../interesAdicionalConvocatorias/interesAdicionalConvocatorias";
import ProfileAvatar from "../modaluserAdmin/modalAdmin";
import Header from "../../../components/layout/header";
import Footer from "@/components/layout/footer";
import { MdCategory } from "react-icons/md";

// ✅ Deja estas importaciones EXACTAMENTE como las pediste
import { getLineas } from "../../api/linea/routes";
import { getConvocatorias, getEntidades } from "../../api/convocatorias/routes";
import { getEmpresas } from "../../api/empresa/route";
import { getUsers } from "../../api/usuarios/route";
import { fetchCiudades } from "../../api/cuidad/route";
import { fetchDepartamentos } from "../../api/departamentos/route";
import { getIntereses } from "../../api/intereses/routes";
import { getRequisitos } from "../../api/requisitos/routes";
import { getCategorias } from "../../api/requirementCategories/route";
import { getRoles } from "../../api/roles/route";
import { getRequirementGroups } from "../../api/tipoRequisitos/routes";
import { getRequirementChecks } from "../../api/requirementChecks/route";
import { getUserInterests } from "../../api/usuarioInteres/route";
import { getCallAdditionalInterests } from "../../api/interesAdicionalConvocatorias/route";
import Favoritos from "../favoritos/favoritos";
import { getPublicos } from "../../api/publicoObjetivo/routes";
import { getInstituciones } from "../../api/entidadInstitucion/route";
import { getFavoritos } from "@/app/api/favoritos/routes";

// Helpers
const formatNumber = (n: number | string) => {
  const x = typeof n === "number" ? n : Number(n || 0);
  return x.toLocaleString("es-CO");
};

// ========================= MODAL =========================
const Modal = ({
  isOpen,
  onClose,
  children,
  modoOscuro,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modoOscuro: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-xl w-full max-w-7xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide transition-colors duration-500 
          ${modoOscuro
            ? "bg-[#1a0526] text-white border border-white/20"
            : "bg-white text-gray-900 border border-gray-200"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-2xl font-bold transition-colors ${modoOscuro
            ? "text-gray-300 hover:text-red-400"
            : "text-gray-500 hover:text-red-500"
            }`}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// ========================= PAGE =========================
const ComponentesCards = () => {
  // UI
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);

  // Contadores
  const [counts, setCounts] = useState<any>({
    lineas: 0,
    convocatorias: 0,
    empresas: 0,
    usuarios: 0,
    ciudades: 0,
    departamentos: 0,
    intereses: 0,
    requisitos: 0,
    categorias: 0,
    roles: 0,
    requirementGroups: 0,
    requirementChecks: 0,
    userInterests: 0,
    callAdditionalInterests: 0,
    // módulos sin API explícita (se mantienen pero no se tocan)
    entidadInstitucion: 0,
    publicoObjetivo: 0,
    historial: 0,
    chequeos: 0,
    favoritos: 0, // si lo expones por otra ruta, cámbialo aquí
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          lineas, convocatorias, empresas, usuarios, ciudades,
          departamentos, intereses, requisitos, categorias, roles,
          requirementGroups, requirementChecks, userInterests, callAdditionalInterests, favoritos, publicoObjetivo, entidadInstitucion
        ] = await Promise.all([
          getLineas(),
          getConvocatorias(),
          getEmpresas(),
          getUsers(),
          fetchCiudades(),
          fetchDepartamentos(),
          getIntereses(),
          getRequisitos(),
          getCategorias(),
          getRoles(),
          getRequirementGroups(),
          getRequirementChecks(),
          getUserInterests(),
          getCallAdditionalInterests(),
          getFavoritos(),
          getPublicos(),        // ✅ nuevo
          getEntidades(),     // ✅ nuevo // si lo expones por otra ruta, cámbialo aquí
        ]);

        setCounts((prev: any) => ({
          ...prev,
          lineas: normalizeCount(lineas),
          convocatorias: normalizeCount(convocatorias),
          empresas: normalizeCount(empresas),
          usuarios: normalizeCount(usuarios),
          ciudades: normalizeCount(ciudades),
          departamentos: normalizeCount(departamentos),
          intereses: normalizeCount(intereses),
          requisitos: normalizeCount(requisitos),
          categorias: normalizeCount(categorias),
          roles: normalizeCount(roles),
          requirementGroups: normalizeCount(requirementGroups),
          requirementChecks: normalizeCount(requirementChecks),
          userInterests: normalizeCount(userInterests),
          callAdditionalInterests: normalizeCount(callAdditionalInterests),
          favoritos: normalizeCount(favoritos),
          publicoObjetivo: normalizeCount(publicoObjetivo),     // ✅
          entidadInstitucion: normalizeCount(entidadInstitucion), // ✅
          // ✅
          chequeos: normalizeCount(requirementChecks),          // ✅
        }));

      } catch (e) {
        console.error("Error cargando conteos", e);
      }
    };
    fetchAll();
  }, []);

  const colorPalette = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-emerald-500 to-emerald-600",
    "from-orange-500 to-orange-600",
    "from-rose-500 to-rose-600",
    "from-teal-500 to-teal-600",
    "from-indigo-500 to-indigo-600",
    "from-pink-500 to-pink-600",
    "from-amber-500 to-amber-600",
    "from-cyan-500 to-cyan-600",
    "from-violet-500 to-violet-600",
    "from-lime-500 to-lime-600",
    "from-red-500 to-red-600",
    "from-green-500 to-green-600",
    "from-yellow-500 to-yellow-600",
    "from-fuchsia-500 to-fuchsia-600",
  ];

  // 🔗 Mapeo de valores dinámicos por módulo (sin tocar tus descripciones ni estructura)
  const valuesById: Record<string, number> = {
    linea: counts.lineas,
    publico: counts.publicoObjetivo, // si luego expones API, reemplaza
    requisitos: counts.requisitos,
    entidad: counts.entidadInstitucion, // si luego expones API, reemplaza
    rol: counts.roles,
    favoritos: counts.requirementChecks, // o requirementGroups/requisitosSeleccion si aplica
    tipo: counts.requirementGroups,
    convocatorias: counts.convocatorias,
    empresa: counts.empresas,
    usuario: counts.usuarios,
    ciudad: counts.ciudades,
    departamento: counts.departamentos,
    interes: counts.intereses,
    checkeo: counts.chequeos, // si tienes API distinta, conéctala
    requisitosCategoria: counts.categorias,
    convocatoriaHistorial: counts.historial, // conecta cuando tengas endpoint
    usuarioInteres: counts.userInterests,
    interesAdicionalConvocatoria: counts.callAdditionalInterests,

  };

  const normalizeCount = (res: any) => {
    if (Array.isArray(res)) return res.length;     // si es un array plano
    if (Array.isArray(res?.data)) return res.data.length; // si viene en .data
    return 0;
  };


  const components = [
    {
      id: "linea",
      icon: User,
      name: "Línea Aplicable",
      descripcion: "Categoría o línea específica en la que se enmarca la convocatoria.",
      component: (m: boolean) => <Linea modoOscuro={m} />,
    },
    {
      id: "publico",
      icon: Users,
      name: "Público Objetivo",
      descripcion: "Personas o grupos a quienes está dirigida la convocatoria.",
      component: (m: boolean) => <PublicoObjetivo modoOscuro={m} />,
    },
    {
      id: "requisitos",
      icon: FileText,
      name: "Requisitos",
      descripcion: "Condiciones generales que deben cumplir los interesados para postularse.",
      component: (m: boolean) => <Requisitos modoOscuro={m} />,
    },
    {
      id: "entidad",
      icon: Building,
      name: "Entidad Institución",
      descripcion: "Institución que organiza, financia o respalda la convocatoria.",
      component: (m: boolean) => <EntidadInstitucion modoOscuro={m} />,
    },
    {
      id: "rol",
      icon: UserCog,
      name: "Rol",
      descripcion: "Función que desempeñará la persona en el proceso de convocatoria.",
      component: (m: boolean) => <Rol modoOscuro={m} />,
    },
    {
      id: "favoritos",
      icon: Star,
      name: "Favoritos",
      descripcion: "Requisitos seleccionados como favoritos por los usuarios.",
      component: (m: boolean) => <Favoritos modoOscuro={m} />,
    },
    {
      id: "tipo",
      icon: Tag,
      name: "Grupo Requisitos",
      descripcion: "Clasificación de requisitos: académicos, financieros, técnicos, etc.",
      component: (m: boolean) => <Tipo modoOscuro={m} />,
    },
    {
      id: "convocatorias",
      icon: Megaphone,
      name: "Convocatorias",
      descripcion: "Listado general de convocatorias disponibles y sus características.",
      component: (m: boolean) => <Convocatorias modoOscuro={m} />,
    },
    {
      id: "empresa",
      icon: Briefcase,
      name: "Empresa",
      descripcion: "Empresas vinculadas a la convocatoria como aliadas o beneficiarias.",
      component: (m: boolean) => <Empresa modoOscuro={m} />,
    },
    {
      id: "usuario",
      icon: Globe2,
      name: "Usuario",
      descripcion: "Personas registradas que pueden interactuar con las convocatorias.",
      component: (m: boolean) => <Usuario modoOscuro={m} />,
    },
    {
      id: "ciudad",
      icon: MapPin,
      name: "Ciudad",
      descripcion: "Ciudad o municipio relacionado con la cobertura de la convocatoria.",
      component: (m: boolean) => <Ciudad modoOscuro={m} />,
    },
    {
      id: "departamento",
      icon: Landmark,
      name: "Departamento",
      descripcion: "Departamento o región administrativa de la convocatoria.",
      component: (m: boolean) => <Departamento modoOscuro={m} />,
    },
    {
      id: "interes",
      icon: Star,
      name: "Interés",
      descripcion: "Áreas temáticas o sectores de interés para personalizar convocatorias.",
      component: (m: boolean) => <Interes modoOscuro={m} />,
    },
    {
      id: "checkeo",
      icon: FaCheckCircle,
      name: "Checkeo",
      descripcion: "Proceso de verificación de información de postulantes.",
      component: (m: boolean) => <Chequeo modoOscuro={m} />,
    },
    {
      id: "requisitosCategoria",
      icon: MdCategory,
      name: "requisitos Categoria",
      descripcion: "Categoría o línea específica en la que se enmarca la convocatoria.",
      component: (m: boolean) => <RequisitosCategoria modoOscuro={m} />,
    },
    {
      id: "convocatoriaHistorial",
      icon: FaClipboardList,
      name: "Convocatoria Historial",
      descripcion: "Registro histórico de convocatorias pasadas y resultados.",
      component: (m: boolean) => <ConvocatoriaHistorial modoOscuro={m} />,
    },
    {
      id: "usuarioInteres",
      icon: FaUserTag,
      name: "Usuario Interés",
      descripcion: "Relación entre usuarios y sus intereses para personalizar experiencias.",
      component: (m: boolean) => <UsuarioInteres modoOscuro={m} />,
    },
    {
      id: "interesAdicionalConvocatoria",
      icon: FaUserTag,
      name: "Interés Adicional Convocatoria",
      descripcion: "Relación entre usuarios y sus intereses para personalizar experiencias.",
      component: (m: boolean) => <InteresAdicionalConvocatoria modoOscuro={m} />,
    }
  ].map((component, index) => ({
    ...component,
    color: colorPalette[index % colorPalette.length],
    value: valuesById[component.id] ?? 0, // ✅ aquí inyectamos el conteo dinámico
  }));

  const handleCardClick = (id: string) => setActiveComponent(id);
  const handleCloseModal = () => setActiveComponent(null);

  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bgColor = modoOscuro
    ? "bg-gradient-to-br from-[#0C0212] via-[#1a0526] to-[#0C0212]"
    : "bg-gray-50";

  const textColor = modoOscuro ? "text-white" : "text-gray-900";
  const cardBg = modoOscuro
    ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:border-[#39A900]/50"
    : "bg-white border border-gray-100 text-gray-800 shadow-sm";

  const sectionBg = modoOscuro
    ? "bg-[#1F0C2AFF] border-[#1a0526] text-white"
    : "bg-white border border-gray-200 text-gray-800";

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${bgColor} ${textColor} relative overflow-hidden`}
    >
      <div className="relative z-10">
        <Modal
          isOpen={!!activeComponent}
          onClose={handleCloseModal}
          modoOscuro={modoOscuro}
        >
          {(() => {
            const comp = components.find((c) => c.id === activeComponent);
            if (!comp) return null;
            if (typeof comp.component === "function") {
              return comp.component(modoOscuro);
            }
            return comp.component;
          })()}
        </Modal>

        {/* Header */}
        <Header
          sectionBg={sectionBg}
          modoOscuro={modoOscuro}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          toggleModoOscuro={toggleModoOscuro}
          toggleLogoutModal={toggleLogoutModal}
          setShowProfileModal={setShowProfileModal}
        />

        {/* Main */}
        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          {/* Statistics (placeholder visual - puedes conectar a KPIs si quieres) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                value: formatNumber(
                  counts.lineas + counts.convocatorias + counts.empresas + counts.usuarios +
                  counts.ciudades + counts.departamentos + counts.intereses + counts.requisitos
                ),
                label: "Total Registros",
                icon: FileText,
                change: "+12%",
                changeType: "increase",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: formatNumber(counts.convocatorias),
                label: "Total Convocatorias",
                icon: Users,
                change: "+5%",
                changeType: "increase",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: formatNumber(counts.usuarios),
                label: "Usuarios",
                icon: Star,
                change: "+8%",
                changeType: "increase",
                color: "from-emerald-500 to-teal-500",
              },
              {
                value: formatNumber(counts.requirementChecks + counts.userInterests),
                label: "Alertas",
                icon: Bell,
                change: "+2",
                changeType: "alert",
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`${cardBg} p-6 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group relative overflow-hidden`}
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm opacity-70 mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-bold ${modoOscuro ? "text-white" : "text-gray-900"}`}>
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`p-4 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="text-white w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/30 dark:border-white/10">
                      <div className={`flex items-center text-sm ${stat.changeType === "alert" ? "text-red-500" : "text-emerald-500"}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs opacity-50">vs último período</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modules Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Módulos del Sistema</h2>
                <p className="opacity-70">
                  Gestiona todos los componentes de la plataforma
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm opacity-70">
                  <Activity className="w-4 h-4" />
                  <span>{filteredComponents.length} módulos disponibles</span>
                </div>
              </div>
            </div>

            {filteredComponents.length === 0 ? (
              <div className={`${cardBg} p-12 text-center rounded-3xl`}>
                <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron módulos
                </h3>
                <p className="opacity-70">
                  No hay módulos que coincidan con "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredComponents.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      onClick={() => handleCardClick(component.id)}
                      className={`${cardBg} rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-[#39A900]/50 transform hover:-translate-y-3 hover:scale-105 group relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${component.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                          <div className={`p-4 bg-gradient-to-r ${component.color} rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                            <Icon className="text-white w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-[#39A900] transition-colors duration-300">
                              {component.name}
                            </h3>
                          </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className={`${modoOscuro ? "text-white" : "text-gray-500"}`}>
                                {component.descripcion}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Valor dinámico */}
                        <div className="pt-4 border-t border-gray-200/30 dark:border-white/10 group-hover:border-[#39A900]/30 transition-colors duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm opacity-70">Cantidad Total</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#39A900] to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                              {formatNumber(component.value || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <ProfileAvatar
                  isOpen={showProfileModal}
                  onClose={() => setShowProfileModal(false)}
                  modoOscuro={modoOscuro}
                />
              </div>
            )}
          </div>
        </main>

        <Footer sectionBg={sectionBg} />
      </div>
    </div>
  );
};

export default ComponentesCards;
