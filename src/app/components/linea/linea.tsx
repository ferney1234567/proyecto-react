'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { FaLaptopCode, FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import ModalLinea from './modal';
import Swal from 'sweetalert2';

interface LineaProps {
  modoOscuro: boolean;
}

interface Linea {
  id: string;
  name: string;
  descripcion: string;
}

export default function Linea({ modoOscuro }: LineaProps) {
  const [lineas, setLineas] = useState<Linea[]>([
    { id: '1', name: 'Tecnología', descripcion: 'Proyectos relacionados con tecnología e innovación' },
    { id: '2', name: 'Educación', descripcion: 'Iniciativas educativas y formativas' },
    { id: '3', name: 'Emprendimiento', descripcion: 'Ideas y apoyo empresarial' },
  ]);

  const [lineaSearchTerm, setLineaSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaLinea, setNuevaLinea] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

// === ALERTAS SWEETALERT2 ===
const showSuccess = (mensaje: string) => {
  Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: mensaje,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#39A900',
    background: modoOscuro ? '#1a0526' : '#fff',
    color: modoOscuro ? '#fff' : '#333'
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
    color: modoOscuro ? '#fff' : '#333'
  });
};


  const handleAddLinea = () => {
    setEditandoId(null);
    setNuevaLinea('');
    setNuevaDescripcion('');
    setMostrarModal(true);
  };

  const handleEditLinea = (linea: Linea) => {
    setEditandoId(linea.id);
    setNuevaLinea(linea.name);
    setNuevaDescripcion(linea.descripcion);
    setMostrarModal(true);
  };

  const handleDeleteLinea = (id: string) => {
    Swal.fire({
      title: '¿Eliminar esta línea?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333'
    }).then((result) => {
      if (result.isConfirmed) {
        setLineas(lineas.filter(linea => linea.id !== id));
        showSuccess('La línea fue eliminada correctamente');
      }
    });
  };

  const handleGuardar = () => {
    if (!nuevaLinea.trim()) {
      showWarning('El nombre de la línea es obligatorio');
      return;
    }

    if (editandoId) {
      setLineas(lineas.map(l =>
        l.id === editandoId ? { ...l, name: nuevaLinea, descripcion: nuevaDescripcion } : l
      ));
      showSuccess('La línea fue actualizada correctamente');
    } else {
      const nueva = { id: Date.now().toString(), name: nuevaLinea, descripcion: nuevaDescripcion };
      setLineas([...lineas, nueva]);
      showSuccess('La línea fue agregada correctamente');
    }
    setMostrarModal(false);
  };

  const filteredLineas = lineas.filter(linea =>
    linea.name.toLowerCase().includes(lineaSearchTerm.toLowerCase()) ||
    linea.descripcion.toLowerCase().includes(lineaSearchTerm.toLowerCase())
  );

  const getIconForLinea = (name: string) => {
    switch (name.toLowerCase()) {
      case 'tecnología': return <FaLaptopCode className="group-hover:rotate-6 transition-transform duration-300" />;
      case 'educación': return <FaGraduationCap className="group-hover:rotate-6 transition-transform duration-300" />;
      case 'emprendimiento': return <FaLightbulb className="group-hover:rotate-6 transition-transform duration-300" />;
      default: return <FaLaptopCode className="group-hover:rotate-6 transition-transform duration-300" />;
    }
  };

  // estilos
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const emptyStateBorder = modoOscuro ? 'border-gray-700' : 'border-gray-300';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const buttonBg = modoOscuro ? 'bg-gray-700' : 'bg-gray-200';
  const buttonText = modoOscuro ? 'text-gray-200' : 'text-gray-700';
  const buttonHover = modoOscuro ? 'hover:bg-gray-600' : 'hover:bg-gray-300';


  return (
    <div className={`rounded-3xl shadow-2xl p-10 max-w-6xl mx-auto my-12 border transition-colors duration-500 ${bgColor} ${textColor} ${borderColor}`}>
      {/* Efectos de fondo decorativos */}
      {!modoOscuro && (
        <>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </>
      )}

      {/* Cabecera */}
      <div className="text-center mb-10 relative z-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${modoOscuro ? 'text-white' : ''}`}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Gestión de Líneas
          </span>
        </h2>
        <p className={`text-lg ${modoOscuro ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Administra las líneas estratégicas de trabajo
        </p>
      </div>

      {/* Buscador y botón */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 relative z-10">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Buscar líneas por nombre o descripción..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md pl-12 ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={lineaSearchTerm}
            onChange={(e) => setLineaSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${modoOscuro ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        <button
          onClick={handleAddLinea}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white text-lg font-medium rounded-2xl hover:shadow-xl transition-all duration-300 hover:brightness-110 transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto justify-center relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#2d8500] to-[#39A900] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Nueva Línea</span>
        </button>
      </div>

      {/* Lista de líneas */}
      <div className="space-y-5 relative z-10">
        {filteredLineas.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border border-dashed transition-colors duration-500 ${emptyStateBg} ${emptyStateBorder}`}>
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${modoOscuro ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <FaLaptopCode className={`w-12 h-12 ${modoOscuro ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <p className={`${modoOscuro ? 'text-gray-400' : 'text-gray-500'} text-lg`}>
              {lineaSearchTerm 
                ? `No se encontraron líneas que coincidan con "${lineaSearchTerm}"`
                : 'Aún no hay líneas registradas'}
            </p>
            <button
              onClick={handleAddLinea}
              className={`mt-4 px-5 py-2 rounded-lg transition-colors duration-300 inline-flex items-center gap-2 ${buttonBg} ${buttonText} ${buttonHover}`}
            >
              <Plus size={18} />
              Crear nueva línea
            </button>
          </div>
        ) : (
          filteredLineas.map((linea) => (
            <div
              key={linea.id}
              className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]/50'}`}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Contenido principal */}
                <div className="flex-1 flex items-start gap-4">
                  <div className={`p-4 rounded-xl flex-shrink-0 group-hover:rotate-6 transition-transform duration-300 ${iconBg} ${modoOscuro ? 'text-[#39A900]' : 'text-[#39A900]'}`}>
                    {getIconForLinea(linea.name)}
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold transition-colors ${modoOscuro ? 'group-hover:text-[#39A900] text-white' : 'group-hover:text-[#39A900] text-gray-800'}`}>
                      {linea.name}
                    </h3>
                    <p className={`pl-2 border-l-4 ${modoOscuro ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-100'}`}>
                      {linea.descripcion}
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    title="Editar línea"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    onClick={() => handleEditLinea(linea)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    title="Eliminar línea"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    onClick={() => handleDeleteLinea(linea.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <ModalLinea
        mostrar={mostrarModal}
        cerrar={() => setMostrarModal(false)}
        nombre={nuevaLinea}
        descripcion={nuevaDescripcion}
        setNombre={setNuevaLinea}
        setDescripcion={setNuevaDescripcion}
        onGuardar={handleGuardar}
        editandoId={editandoId}
        modoOscuro={modoOscuro}
      />
    </div>
  );
}