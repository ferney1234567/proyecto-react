'use client';

import { useState } from "react";
import {
  FaBullhorn, FaCalendarAlt, FaCalendarTimes, FaBuilding, FaRegFileAlt, FaCheckCircle,
  FaRegBookmark, FaSearch, FaInfoCircle, FaLink, FaGlobe, FaListAlt, FaUsers,
  FaStar, FaUser, FaTimes
} from "react-icons/fa";

export default function ModalConvocatoria({ modalAbierto, cerrarModal }) {
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");

  if (!modalAbierto) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex justify-center items-center">
      <div className="relative bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in border border-gray-200">

        {/* ENCABEZADO */}
        <div className="p-6 px-8 flex justify-between items-center bg-gradient-to-r from-[#00324D] to-[#00668c] rounded-t-2xl">
          <div className="flex-grow text-center">
            <h3 className="text-2xl font-semibold text-white flex justify-center items-center gap-3">
              <FaBullhorn className="text-yellow-300 text-2xl" />
              Financiamiento para Proyectos Culturales
            </h3>
          </div>
          <button onClick={cerrarModal} className="absolute top-6 right-6 text-gray-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* IMAGEN */}
        <div className="flex justify-center items-center p-6">
          <img 
  src="/img/cienciasSalud.jpg" 
  alt="Convocatoria" 
  className="w-full max-w-[1000px] max-h-[400px] object-cover rounded-xl shadow-md border border-gray-200"
/>
</div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mx-8 mb-6">
          {[{
            icon: <FaCalendarAlt className="text-blue-500 text-3xl" />, 
            label: 'Fecha de Apertura', 
            value: '01 Feb 2025',
            bg: 'bg-blue-50'
          }, {
            icon: <FaCalendarTimes className="text-red-500 text-3xl" />, 
            label: 'Fecha de Cierre', 
            value: '02 Jul 2025',
            bg: 'bg-red-50'
          }, {
            icon: <FaBuilding className="text-purple-600 text-3xl" />, 
            label: 'Entidad', 
            value: 'SENA',
            bg: 'bg-purple-50'
          }].map(({ icon, label, value, bg }, i) => (
            <div key={i} className={`${bg} border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300`}>
              <div className="flex flex-col items-center text-center gap-2">
                {icon}
                <p className="text-sm text-gray-600 font-medium">{label}</p>
                <strong className="text-gray-800 text-base font-semibold">{value}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* PESTAÑAS */}
        <div className="flex flex-wrap justify-center gap-1 mx-8 border-b border-gray-200 pb-2">
          {[
            { id: 'descripcion', icon: FaRegFileAlt, label: 'Descripción', color: 'text-blue-600' },
            { id: 'objetivos', icon: FaCheckCircle, label: 'Objetivos', color: 'text-green-600' },
            { id: 'recursos', icon: FaRegBookmark, label: 'Recursos', color: 'text-yellow-600' },
            { id: 'observaciones', icon: FaSearch, label: 'Observaciones', color: 'text-orange-600' },
            { id: 'masInformacion', icon: FaInfoCircle, label: 'Más información', color: 'text-purple-600' },
          ].map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setPestanaActiva(id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 ${pestanaActiva === id ? `bg-white shadow-sm ${color} border-t-2 border-${color.split('-')[1]}-500` : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className={`text-base ${pestanaActiva === id ? color : 'text-gray-400'}`} /> 
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* CONTENIDO PESTAÑAS */}
        <div className="bg-white p-6 mx-8 rounded-xl min-h-[150px] mb-6 shadow-sm border border-gray-100">
          {pestanaActiva === 'descripcion' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaRegFileAlt className="text-blue-500" />
                Descripción de la Convocatoria
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Esta convocatoria busca <span className="font-semibold text-blue-600">apoyar iniciativas artísticas y culturales comunitarias</span> que promuevan el desarrollo social y la preservación del patrimonio cultural. 
                Los proyectos deben estar enfocados en la participación ciudadana y el fortalecimiento de las expresiones culturales locales.
              </p>
            </div>
          )}
          {pestanaActiva === 'objetivos' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Objetivos Principales
              </h4>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> Impulsar la cultura a nivel nacional mediante proyectos de inclusión.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> Fomentar la participación de comunidades vulnerables en actividades culturales.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> Promover la diversidad cultural y el diálogo intercultural.
                </li>
              </ul>
            </div>
          )}
          {pestanaActiva === 'recursos' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaRegBookmark className="text-yellow-500" />
                Recursos Disponibles
              </h4>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-yellow-600">$50,000,000 COP</span> disponibles para financiar los proyectos ganadores, distribuidos de la siguiente manera:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  {[
                    { label: 'Proyectos individuales', amount: 'Hasta $5,000,000' },
                    { label: 'Colectivos culturales', amount: 'Hasta $10,000,000' },
                    { label: 'Organizaciones', amount: 'Hasta $15,000,000' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-yellow-100 shadow-xs">
                      <p className="text-xs text-yellow-700 font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-gray-800">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {pestanaActiva === 'observaciones' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaSearch className="text-orange-500" />
                Observaciones Importantes
              </h4>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                <ul className="text-sm text-gray-700 leading-relaxed space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span> Los proyectos deben tener enfoque social y estar liderados por comunidades.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span> Se dará prioridad a proyectos que incluyan poblaciones vulnerables.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span> La documentación debe presentarse completa antes de la fecha límite.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span> No se aceptarán proyectos que hayan recibido financiamiento anteriormente.
                  </li>
                </ul>
              </div>
            </div>
          )}
          {pestanaActiva === 'masInformacion' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-purple-500" />
                Información Adicional
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{
                  icon: <FaLink className="text-blue-500" />, 
                  label: 'Link de la Convocatoria', 
                  value: <a href="https://ejemplo.com/convocatoria" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">https://ejemplo.com/convocatoria</a>
                }, {
                  icon: <FaGlobe className="text-green-500" />, 
                  label: 'Sitio Web Oficial', 
                  value: 'ConvocatoriasCultura.gov.co'
                }, {
                  icon: <FaListAlt className="text-purple-500" />, 
                  label: 'Línea de Financiamiento', 
                  value: 'Cultura y Territorio'
                }, {
                  icon: <FaUsers className="text-cyan-500" />, 
                  label: 'Público Objetivo', 
                  value: 'Jóvenes rurales, comunidades indígenas y afrodescendientes'
                }, {
                  icon: <FaStar className="text-yellow-500" />, 
                  label: 'Área de Interés', 
                  value: 'Inclusión Social y Desarrollo Cultural'
                }, {
                  icon: <FaUser className="text-pink-500" />, 
                  label: 'Contacto Responsable', 
                  value: 'Mariana Gómez - mgomez@cultura.gov.co'
                }].map(({ icon, label, value }, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-xs border border-gray-100 hover:shadow-sm transition flex gap-3 items-start">
                    <div className="mt-1">{icon}</div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                      <div className="text-sm text-gray-800">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-8 pt-6 pb-8 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button 
            onClick={cerrarModal} 
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold flex items-center justify-center gap-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
          >
            <FaTimes /> Cancelar
          </button>
          <button 
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#39A900] to-[#2a8200] text-white font-semibold flex items-center justify-center gap-2 text-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
          >
            <FaCheckCircle /> Inscribirse
          </button>
         
        </div>

      </div>
    </div>
  );
}



/*'use client';

import { useState } from "react";
import {
  FaBullhorn, FaCalendarAlt, FaCalendarTimes, FaBuilding, FaRegFileAlt, FaCheckCircle,
  FaRegBookmark, FaSearch, FaInfoCircle, FaLink, FaGlobe, FaListAlt, FaUsers,
  FaStar, FaUser, FaTimes, FaArrowRight
} from "react-icons/fa";

// Componente para las tarjetas de información
const InfoCard = ({ icon, label, value, bgColor, textColor }) => (
  <div className={`flex items-center p-4 rounded-lg shadow-sm transition-transform transform hover:-translate-y-1 ${bgColor}`}>
    <div className="p-3 rounded-full bg-white mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
    </div>
  </div>
);

// Componente para los botones de las pestañas
const TabButton = ({ id, activeTab, setActiveTab, icon: Icon, label, color }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
      activeTab === id
        ? `bg-blue-600 text-white shadow-md`
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon className="text-base" />
    <span>{label}</span>
  </button>
);

// Componente para la sección de "Más Información"
const MoreInfoSection = () => {
    const infoItems = [
        {
          icon: <FaLink className="text-blue-500" />,
          label: "Link de la Convocatoria",
          value: (
            <a href="https://ejemplo.com/convocatoria" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 break-all">
              https://ejemplo.com/convocatoria
            </a>
          ),
        },
        {
            icon: <FaGlobe className="text-green-500" />,
            label: "Sitio Web Oficial",
            value: "ConvocatoriasCultura.gov.co",
        },
        {
            icon: <FaListAlt className="text-purple-500" />,
            label: "Línea de Financiamiento",
            value: "Cultura y Territorio",
        },
        {
            icon: <FaUsers className="text-cyan-500" />,
            label: "Público Objetivo",
            value: "Jóvenes rurales, comunidades indígenas y afrodescendientes",
        },
        {
            icon: <FaStar className="text-yellow-500" />,
            label: "Área de Interés",
            value: "Inclusión Social y Desarrollo Cultural",
        },
        {
            icon: <FaUser className="text-pink-500" />,
            label: "Contacto Responsable",
            value: "Mariana Gómez - mgomez@cultura.gov.co",
        },
    ];

    return (
        <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-purple-500" />
                Información Adicional
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoItems.map(({ icon, label, value }, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start gap-3 hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 mt-1 text-xl">{icon}</div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
                            <div className="text-sm text-gray-800 font-medium">{value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ModalConvocatoria({ modalAbierto, cerrarModal }) {
  const [pestanaActiva, setPestanaActiva] = useState("descripcion");

  if (!modalAbierto) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="relative bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl animate-fade-in border-t-4 border-blue-600">
        
        
        <div className="p-6 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaBullhorn className="text-blue-600" />
              Financiamiento para Proyectos Culturales
            </h3>
            <p className="text-sm text-gray-500 mt-1">Convocatoria Nacional de Estímulos 2025</p>
          </div>
          <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition">
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <img 
                    src="/img/cienciasSalud.jpg"
                    alt="Convocatoria" 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="flex flex-col gap-4 justify-center">
                    <InfoCard 
                        icon={<FaCalendarAlt className="text-blue-500 text-2xl" />}
                        label="Fecha de Apertura"
                        value="01 Feb 2025"
                        bgColor="bg-blue-50"
                        textColor="text-blue-800"
                    />
                    <InfoCard 
                        icon={<FaCalendarTimes className="text-red-500 text-2xl" />}
                        label="Fecha de Cierre"
                        value="02 Jul 2025"
                        bgColor="bg-red-50"
                        textColor="text-red-800"
                    />
                    <InfoCard 
                        icon={<FaBuilding className="text-purple-600 text-2xl" />}
                        label="Entidad"
                        value="SENA"
                        bgColor="bg-purple-50"
                        textColor="text-purple-800"
                    />
                </div>
            </div>

          
            <div className="flex flex-wrap justify-center gap-2 mb-6 p-2 bg-gray-100 rounded-lg">
                {[
                    { id: 'descripcion', icon: FaRegFileAlt, label: 'Descripción' },
                    { id: 'objetivos', icon: FaCheckCircle, label: 'Objetivos' },
                    { id: 'recursos', icon: FaRegBookmark, label: 'Recursos' },
                    { id: 'observaciones', icon: FaSearch, label: 'Observaciones' },
                    { id: 'masInformacion', icon: FaInfoCircle, label: 'Más información' },
                ].map(({ id, icon, label }) => (
                    <TabButton
                        key={id}
                        id={id}
                        activeTab={pestanaActiva}
                        setActiveTab={setPestanaActiva}
                        icon={icon}
                        label={label}
                    />
                ))}
            </div>

            
            <div className="p-2 min-h-[200px]">
              {pestanaActiva === 'descripcion' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaRegFileAlt className="text-blue-500" />
                    Descripción de la Convocatoria
                  </h4>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Esta convocatoria busca <span className="font-semibold text-blue-700">apoyar iniciativas artísticas y culturales comunitarias</span> que promuevan el desarrollo social y la preservación del patrimonio cultural. 
                    Los proyectos deben estar enfocados en la participación ciudadana y el fortalecimiento de las expresiones culturales locales.
                  </p>
                </div>
              )}
              {pestanaActiva === 'objetivos' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Objetivos Principales
                  </h4>
                  <ul className="text-base text-gray-600 leading-relaxed space-y-3">
                    <li className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Impulsar la cultura a nivel nacional mediante proyectos de inclusión.
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Fomentar la participación de comunidades vulnerables en actividades culturales.
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Promover la diversidad cultural y el diálogo intercultural.
                    </li>
                  </ul>
                </div>
              )}
              {pestanaActiva === 'recursos' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaRegBookmark className="text-yellow-500" />
                    Recursos Disponibles
                  </h4>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-5">
                    <p className="text-base text-gray-700 leading-relaxed">
                      Se dispone de un fondo total de <span className="font-bold text-yellow-700">$50,000,000 COP</span> para financiar los proyectos ganadores, distribuidos de la siguiente manera:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {[
                        { label: 'Proyectos individuales', amount: 'Hasta $5,000,000' },
                        { label: 'Colectivos culturales', amount: 'Hasta $10,000,000' },
                        { label: 'Organizaciones', amount: 'Hasta $15,000,000' }
                      ].map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm text-center">
                          <p className="text-sm text-yellow-800 font-medium">{item.label}</p>
                          <p className="text-lg font-bold text-gray-800">{item.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {pestanaActiva === 'observaciones' && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaSearch className="text-orange-500" />
                    Observaciones Importantes
                  </h4>
                  <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-5">
                    <ul className="text-base text-gray-600 leading-relaxed space-y-3">
                        <li className="flex items-start gap-3">
                            <FaArrowRight className="text-orange-500 mt-1 flex-shrink-0" /> Los proyectos deben tener enfoque social y estar liderados por comunidades.
                        </li>
                        <li className="flex items-start gap-3">
                            <FaArrowRight className="text-orange-500 mt-1 flex-shrink-0" /> Se dará prioridad a proyectos que incluyan poblaciones vulnerables.
                        </li>
                        <li className="flex items-start gap-3">
                            <FaArrowRight className="text-orange-500 mt-1 flex-shrink-0" /> La documentación debe presentarse completa antes de la fecha límite.
                        </li>
                        <li className="flex items-start gap-3">
                            <FaArrowRight className="text-orange-500 mt-1 flex-shrink-0" /> No se aceptarán proyectos que hayan recibido financiamiento anteriormente.
                        </li>
                    </ul>
                  </div>
                </div>
              )}
              {pestanaActiva === 'masInformacion' && (
                <MoreInfoSection />
              )}
            </div>
        </div>

      
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
          <button 
            onClick={cerrarModal} 
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 text-sm hover:bg-gray-300 transition duration-200"
          >
            <FaTimes /> Cerrar
          </button>
          <button 
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            <FaCheckCircle /> Inscribirse Ahora
          </button>
        </div>
      </div>
    </div>
  );
}

*/