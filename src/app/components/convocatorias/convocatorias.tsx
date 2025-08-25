'use client';

import { useState } from "react";
import { 
  Plus, Edit, Trash2, Gem, Target, FileText, User, BookText, 
  Users, Star, Building, Calendar, Globe, Link as LinkIcon 
} from "lucide-react";
import ConvocatoriaModal from "./crearConvocatoria";
import Swal from 'sweetalert2';

interface ConvocatoriasProps {
  modoOscuro: boolean;
}

interface Convocatoria {
  id: string;
  nombre: string;
  descripcion: string;
  recursos: string;
  link: string;
  fechaApertura: string;
  fechaCierre: string;
  nombrePagina: string;
  pagina: string;
  objetivos: string;
  observaciones: string;
  entidad: string;
  linea: string;
  publicoObjetivo: string;
  interes: string;
  usuario: string;
  imagen?: string;
}


export default function Convocatorias({ modoOscuro }: ConvocatoriasProps) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([
    {
      id: "1",
      nombre: "Becas de Investigación 2023",
      descripcion: "Convocatoria para proyectos de investigación en ciencias básicas",
      recursos: "USD 10,000 por proyecto",
      link: "https://ejemplo.com/becas-investigacion",
      fechaApertura: "2023-01-15",
      fechaCierre: "2023-03-30",
      nombrePagina: "Ministerio de Ciencia",
      pagina: "https://ministerio-ciencia.gov",
      objetivos: "Fomentar la investigación científica",
      observaciones: "Prioridad para proyectos interdisciplinarios",
      entidad: "Ministerio de Ciencia",
      linea: "Investigación Básica",
      publicoObjetivo: "Investigadores con al menos 2 años de experiencia",
      interes: "Ciencias Naturales",
      usuario: "admin",
      imagen: "/img/R.jpg"
    },
    {
      id: "2",
      nombre: "Talleres de Innovación Tecnológica",
      descripcion: "Talleres prácticos para emprendedores tecnológicos",
      recursos: "Materiales y mentorías incluidas",
      link: "https://ejemplo.com/talleres-innovacion",
      fechaApertura: "2023-02-01",
      fechaCierre: "2023-04-15",
      nombrePagina: "Agencia de Innovación",
      pagina: "https://innovacion.gov",
      objetivos: "Capacitar en herramientas tecnológicas emergentes",
      observaciones: "Cupos limitados a 30 participantes",
      entidad: "Agencia de Innovación",
      linea: "Formación Tecnológica",
      publicoObjetivo: "Emprendedores y startups",
      interes: "Tecnología e Innovación",
      usuario: "editor",
      imagen: "/img/R.jpg"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nuevaConvocatoria, setNuevaConvocatoria] = useState<Convocatoria>({
    id: "", nombre: "", descripcion: "", recursos: "", link: "", fechaApertura: "", fechaCierre: "",
    nombrePagina: "", pagina: "", objetivos: "", observaciones: "", entidad: "", linea: "",
    publicoObjetivo: "", interes: "", usuario: "", imagen: ""
  });

  const filteredConvocatorias = convocatorias.filter(
    (conv) =>
      conv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.entidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaConvocatoria({ ...nuevaConvocatoria, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevaConvocatoria({
          ...nuevaConvocatoria,
          imagen: reader.result as string
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddConvocatoria = () => {
    setEditingId(null);
    setNuevaConvocatoria({
      id: "", nombre: "", descripcion: "", recursos: "", link: "", fechaApertura: "", fechaCierre: "",
      nombrePagina: "", pagina: "", objetivos: "", observaciones: "", entidad: "", linea: "",
      publicoObjetivo: "", interes: "", usuario: "", imagen: ""
    });
    setMostrarModal(true);
  };

  const handleEditConvocatoria = (id: string) => {
    const convToEdit = convocatorias.find((c) => c.id === id);
    if (convToEdit) {
      setEditingId(id);
      setNuevaConvocatoria(convToEdit);
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditingId(null);
  };

  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const showWarning = (mensaje: string) => {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });
  };

  const handleSaveConvocatoria = () => {
    if (!nuevaConvocatoria.nombre || !nuevaConvocatoria.descripcion || !nuevaConvocatoria.entidad) {
        showWarning('Los campos Nombre, Descripción y Entidad son obligatorios.');
        return;
    }

    if (editingId) {
      setConvocatorias(
        convocatorias.map((c) =>
          c.id === editingId ? nuevaConvocatoria : c
        )
      );
      showSuccess('Convocatoria actualizada correctamente.');
    } else {
      const nueva = {
        ...nuevaConvocatoria,
        id: Date.now().toString()
      };
      setConvocatorias([...convocatorias, nueva]);
      showSuccess('Convocatoria creada exitosamente.');
    }
    cerrarModal();
  };

  const handleDelete = (id: string) => {
    Swal.fire({
        title: '¿Estás seguro de eliminar esta convocatoria?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: modoOscuro ? '#1a0526' : '#fff',
        color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
        if (result.isConfirmed) {
            setConvocatorias(convocatorias.filter((c) => c.id !== id));
            showSuccess('La convocatoria ha sido eliminada.');
        }
    });
  };

  // Estilos condicionales
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = modoOscuro ? 'focus:ring-[#39A900] focus:border-[#39A900]' : 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50/50';
  const emptyStateBorder = modoOscuro ? 'border-gray-700' : 'border-dashed border-gray-200';
  const iconColor = modoOscuro ? 'text-[#39A900]' : 'text-[#39A900]';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
  const borderLight = modoOscuro ? 'border-gray-700' : 'border-gray-200';
  const linkColor = modoOscuro ? 'text-[#39A900] hover:text-[#2d8500]' : 'text-[#39A900] hover:text-[#2d8500]';

  return (
  <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
    {/* Background decoration - solo en modo claro */}
    {!modoOscuro && (
      <>
        <div className="absolute -top-5 -left-5 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </>
    )}

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Gestión de Convocatorias
        </h2>
        <p className={`text-lg ${secondaryText}`}>
          Administra las convocatorias publicadas
        </p>
      </div>

      {/* Search + button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Buscar convocatorias..."
          className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddConvocatoria}
          className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Crear Convocatoria
        </button>
      </div>

      {/* Convocatorias list */}
      <div className="space-y-6">
        {filteredConvocatorias.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border ${emptyStateBg} ${emptyStateBorder}`}>
            <p className={`${secondaryText} text-lg`}>
              {searchTerm 
                ? `No se encontraron convocatorias que coincidan con "${searchTerm}"`
                : 'Aún no hay convocatorias publicadas'}
            </p>
          </div>
        ) : (
          filteredConvocatorias.map((conv) => (
            <div 
              key={conv.id} 
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start gap-6 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
            >
              {/* Image */}
              {conv.imagen && (
                <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={conv.imagen} 
                    alt={conv.nombre} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 space-y-4">
                <h3 className={`text-2xl font-bold transition-colors cursor-pointer ${modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'}`}>
                  {conv.nombre}
                </h3>
                <p className={`text-md ${detailText}`}>{conv.descripcion}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t ${borderLight}">
                  {/* Left column */}
                  <div className="space-y-3">
                    <p className="flex items-start gap-3 text-sm">
                      <Gem size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Recursos:</span> {conv.recursos}</span>
                    </p>
                    <p className="flex items-start gap-3 text-sm">
                      <Target size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Objetivos:</span> {conv.objetivos}</span>
                    </p>
                    <p className="flex items-start gap-3 text-sm">
                      <FileText size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Observaciones:</span> {conv.observaciones}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <User size={16} className={`${iconColor} flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Publicado por:</span> {conv.usuario}</span>
                    </p>
                  </div>
                  
                  {/* Right column */}
                  <div className="space-y-3">
                    <p className="flex items-center gap-3 text-sm">
                      <BookText size={16} className={`${iconColor} flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Línea:</span> {conv.linea}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <Users size={16} className={`${iconColor} flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Público Objetivo:</span> {conv.publicoObjetivo}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <Star size={16} className={`${iconColor} flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Área de Interés:</span> {conv.interes}</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <Building size={16} className={`${iconColor} flex-shrink-0`} />
                      <span><span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Entidad:</span> {conv.entidad}</span>
                    </p>
                  </div>
                </div>

                {/* Dates and Links */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t ${borderLight} text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className={iconColor} />
                    <span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Apertura:</span>
                    <span>{conv.fechaApertura}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-red-500" />
                    <span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Cierre:</span>
                    <span>{conv.fechaCierre}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe size={16} className={iconColor} />
                    <span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Página Web:</span>
                    <a href={conv.pagina} target="_blank" rel="noopener noreferrer" className={`${linkColor} hover:underline`}>
                      {conv.nombrePagina || 'Visitar sitio'}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <LinkIcon size={16} className={iconColor} />
                    <span className={`font-semibold ${modoOscuro ? 'text-gray-300' : 'text-gray-800'}`}>Convocatoria:</span>
                    <a href={conv.link} target="_blank" rel="noopener noreferrer" className={`${linkColor} hover:underline font-semibold`}>
                      Ver enlace directo
                    </a>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 self-end sm:self-center mt-4 sm:mt-0">
                <button
                  onClick={() => handleEditConvocatoria(conv.id)}
                  title="Editar convocatoria"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <Edit size={20} className="flex-shrink-0" />
                </button>
                <button
                  onClick={() => handleDelete(conv.id)}
                  title="Eliminar convocatoria"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  <Trash2 size={20} className="flex-shrink-0" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
     {mostrarModal && (
        <ConvocatoriaModal
          mostrarModal={mostrarModal}
          cerrarModal={cerrarModal}
          convocatoria={nuevaConvocatoria}
          handleInputChange={handleInputChange}
         handleImageChange={handleImageChange}

          handleSaveConvocatoria={handleSaveConvocatoria}
          editingId={editingId}
          modoOscuro={modoOscuro}
        />
      )}
    </div>
  );
}