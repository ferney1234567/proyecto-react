"use client";

import React, { useState } from "react";
import {
  User, Users, FileText, Building, UserCog, CheckSquare, Tag, Megaphone, Briefcase, Globe2, MapPin,
  Landmark, Star, Search, Bell, Activity, TrendingUp,
} from "lucide-react";
import { FaCheckCircle, FaClipboardList } from "react-icons/fa";
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
import RequisitosCategoria from "../requisitosCategoria/requisitosCategoria";
import ConvocatoriaHistorial from "../convocatoriaHistorial/convocatoriaHistorial";
import ProfileAvatar from "../modaluserAdmin/modalAdmin";
import Header from "../../../components/layout/header";
import Footer from "@/components/layout/footer";
import { MdCategory } from "react-icons/md";



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
      onClick={onClose} // 👉 cerrar si se hace clic fuera
    >
      <div
        className={`rounded-xl w-full max-w-7xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide transition-colors duration-500 
          ${modoOscuro
            ? "bg-[#1a0526] text-white border border-white/20"
            : "bg-white text-gray-900 border border-gray-200"
          }`}
        onClick={(e) => e.stopPropagation()} // 👉 evita que el click dentro cierre el modal
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

const ComponentesCards = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);
  const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toggleModoOscuro = () => setModoOscuro(!modoOscuro);

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

  const components = [
    {
      id: "linea",
      icon: User,
      name: "Línea Aplicable",
      value: "1,868",
      descripcion: "Categoría o línea específica en la que se enmarca la convocatoria.",
      component: (m: boolean) => <Linea modoOscuro={m} />,
    },
    {
      id: "publico",
      icon: Users,
      name: "Público Objetivo",
      value: "1,868",
      descripcion: "Personas o grupos a quienes está dirigida la convocatoria.",
      component: (m: boolean) => <PublicoObjetivo modoOscuro={m} />,
    },
    {
      id: "requisitos",
      icon: FileText,
      name: "Requisitos",
      value: "5,268",
      descripcion: "Condiciones generales que deben cumplir los interesados para postularse.",
      component: (m: boolean) => <Requisitos modoOscuro={m} />,
    },
    {
      id: "entidad",
      icon: Building,
      name: "Entidad Institución",
      value: "12,868",
      descripcion: "Institución que organiza, financia o respalda la convocatoria.",
      component: (m: boolean) => <EntidadInstitucion modoOscuro={m} />,
    },
    {
      id: "rol",
      icon: UserCog,
      name: "Rol",
      value: "28,468",
      descripcion: "Función que desempeñará la persona en el proceso de convocatoria.",
      component: (m: boolean) => <Rol modoOscuro={m} />,
    },
    {
      id: "requisitos-sel",
      icon: CheckSquare,
      name: "Requisitos Selección",
      value: "890",
      descripcion: "Criterios específicos para seleccionar a los postulantes.",
      component: (m: boolean) => <RequisitoSeleccion modoOscuro={m} />,
    },
    {
      id: "tipo",
      icon: Tag,
      name: "Tipo Requisitos",
      value: "2,368",
      descripcion: "Clasificación de requisitos: académicos, financieros, técnicos, etc.",
      component: (m: boolean) => <Tipo modoOscuro={m} />,
    },
    {
      id: "convocatorias",
      icon: Megaphone,
      name: "Convocatorias",
      value: "1,868",
      descripcion: "Listado general de convocatorias disponibles y sus características.",
      component: (m: boolean) => <Convocatorias modoOscuro={m} />,
    },
    {
      id: "empresa",
      icon: Briefcase,
      name: "Empresa",
      value: "5,268",
      descripcion: "Empresas vinculadas a la convocatoria como aliadas o beneficiarias.",
      component: (m: boolean) => <Empresa modoOscuro={m} />,
    },
    {
      id: "usuario",
      icon: Globe2,
      name: "Usuario",
      value: "12,868",
      descripcion: "Personas registradas que pueden interactuar con las convocatorias.",
      component: (m: boolean) => <Usuario modoOscuro={m} />,
    },
    {
      id: "ciudad",
      icon: MapPin,
      name: "Ciudad",
      value: "28,468",
      descripcion: "Ciudad o municipio relacionado con la cobertura de la convocatoria.",
      component: (m: boolean) => <Ciudad modoOscuro={m} />,
    },
    {
      id: "departamento",
      icon: Landmark,
      name: "Departamento",
      value: "890",
      descripcion: "Departamento o región administrativa de la convocatoria.",
      component: (m: boolean) => <Departamento modoOscuro={m} />,
    },
    {
      id: "interes",
      icon: Star,
      name: "Interés",
      value: "2,368",
      descripcion: "Áreas temáticas o sectores de interés para personalizar convocatorias.",
      component: (m: boolean) => <Interes modoOscuro={m} />,
    },
    {
      id: "checkeo",
      icon: FaCheckCircle,
      name: "Checkeo",
      value: "890",
      descripcion: "Proceso de verificación de información de postulantes.",
      component: (m: boolean) => <Chequeo modoOscuro={m} />,
    },
     {
  id: "requisitosCategoria",
  icon: MdCategory,
  name: "requisitos Categoria",
  value: "1,868",
  descripcion: "Categoría o línea específica en la que se enmarca la convocatoria.",
  component: (m: boolean) => <RequisitosCategoria modoOscuro={m} />,
},
    {
      id: "convocatoriaHistorial",
      icon: FaClipboardList,
      name: "Convocatoria Historial",
      value: "2,368",
      descripcion: "Registro histórico de convocatorias pasadas y resultados.",
      component: (m: boolean) => <ConvocatoriaHistorial modoOscuro={m} />,
    },
  ].map((component, index) => ({
    ...component,
    color: colorPalette[index % colorPalette.length],
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
      {/* Fondo de partículas */}


      {/* Resto del contenido con z-index mayor */}
      <div className="relative z-10">
        <Modal
          isOpen={!!activeComponent}
          onClose={handleCloseModal}
          modoOscuro={modoOscuro}
        >
          {(() => {
            const comp = components.find((c) => c.id === activeComponent);
            if (!comp) return null;

            // Si el componente es una función, pasarle modoOscuro
            if (typeof comp.component === "function") {
              return comp.component(modoOscuro);
            }

            // Si es un elemento JSX, renderizarlo directamente
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                value: "1.2M",
                label: "Total Registros",
                icon: FileText,
                change: "+12%",
                changeType: "increase",
                color: "from-blue-500 to-cyan-500",
              },
              {
                value: "48",
                label: "Total Convocatorias",
                icon: Users,
                change: "+5%",
                changeType: "increase",
                color: "from-purple-500 to-pink-500",
              },
              {
                value: "328",
                label: "Nuevos Hoy",
                icon: Star,
                change: "+8%",
                changeType: "increase",
                color: "from-emerald-500 to-teal-500",
              },
              {
                value: "3",
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
                  {/* Background gradient effect */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm opacity-70 mb-1">{stat.label}</p>
                        <h3
                          className={`text-3xl font-bold ${modoOscuro ? "text-white" : "text-gray-900"
                            }`}
                        >
                          {stat.value}
                        </h3>
                      </div>
                      <div
                        className={`p-4 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <Icon className="text-white w-6 h-6" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/30 dark:border-white/10">
                      <div
                        className={`flex items-center text-sm ${stat.changeType === "alert"
                          ? "text-red-500"
                          : "text-emerald-500"
                          }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs opacity-50">
                        vs último período
                      </span>
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
                      {/* Hover gradient effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${component.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      ></div>

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                          <div
                            className={`p-4 bg-gradient-to-r ${component.color} rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                          >
                            <Icon className="text-white w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-[#39A900] transition-colors duration-300">
                              {component.name}
                            </h3>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              {/* Aquí mostramos la descripción dinámica con color según modo oscuro */}
                              <span
                                className={`${modoOscuro ? "text-white" : "text-gray-500"
                                  }`}
                              >
                                {component.descripcion}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Value */}
                        <div className="pt-4 border-t border-gray-200/30 dark:border-white/10 group-hover:border-[#39A900]/30 transition-colors duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm opacity-70">
                              Cantidad Total
                            </span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#39A900] to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                              ${component.value}
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
