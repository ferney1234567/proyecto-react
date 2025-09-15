'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { FaLaptopCode, FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import ModalLinea from './crearLinea';
import EditarLineaModal from './editarLinea';
import Swal from 'sweetalert2';
import { getLineas, createLinea, updateLinea, deleteLinea } from '../../api/linea/routes';

interface LineaProps {
  modoOscuro: boolean;
}

interface Linea {
  id: string;
  name: string;
  description: string;
}

export default function Linea({ modoOscuro }: LineaProps) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [lineaSearchTerm, setLineaSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [nuevaLinea, setNuevaLinea] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  const showWarning = (mensaje: string) =>
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  // === Cargar líneas desde API ===
  const cargarLineas = async () => {
    try {
      const data = await getLineas();
      setLineas(data.data || []);
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  useEffect(() => {
    cargarLineas();
  }, []);

  // === CREAR / ACTUALIZAR ===
  const handleGuardar = async () => {
    if (!nuevaLinea.trim()) {
      showWarning('El nombre de la línea es obligatorio');
      return;
    }
    try {
      if (editandoId) {
        await updateLinea(editandoId, { name: nuevaLinea, description: nuevaDescripcion });
        showSuccess('La línea fue actualizada correctamente');
        setMostrarModalEditar(false);
      } else {
        await createLinea({ name: nuevaLinea, description: nuevaDescripcion });
        showSuccess('La línea fue agregada correctamente');
        setMostrarModal(false);
      }
      await cargarLineas();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // === ELIMINAR ===
  const handleDeleteLinea = (id: string) => {
    Swal.fire({
      title: '¿Eliminar esta línea?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteLinea(id);
          await cargarLineas();
          showSuccess('La línea fue eliminada correctamente');
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  // === EDITAR ===
  const handleEditLinea = (linea: Linea) => {
    setEditandoId(linea.id);
    setNuevaLinea(linea.name);
    setNuevaDescripcion(linea.description);
    setMostrarModalEditar(true);
  };

  // === NUEVA ===
  const handleAddLinea = () => {
    setEditandoId(null);
    setNuevaLinea('');
    setNuevaDescripcion('');
    setMostrarModal(true);
  };

  // === FILTRO ===
  const filteredLineas = lineas.filter(
    (linea) =>
      linea.name.toLowerCase().includes(lineaSearchTerm.toLowerCase()) ||
      linea.description.toLowerCase().includes(lineaSearchTerm.toLowerCase())
  );

  // === ICONOS ===
  const getIconForLinea = (name: string) => {
    switch (name.toLowerCase()) {
      case 'tecnología': return <FaLaptopCode />;
      case 'educación': return <FaGraduationCap />;
      case 'emprendimiento': return <FaLightbulb />;
      default: return <FaLaptopCode />;
    }
  };

  // ==================== ESTILOS ====================
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const placeholderColor = modoOscuro ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';

  // ==================== RENDER ====================
  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Líneas
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra las líneas estratégicas de trabajo</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar líneas..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
              value={lineaSearchTerm}
              onChange={(e) => setLineaSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleAddLinea}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Nueva Línea
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredLineas.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron líneas</p>
            </div>
          ) : (
            filteredLineas.map((linea) => (
              <div
                key={linea.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                    {getIconForLinea(linea.name)}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${modoOscuro ? 'text-white hover:text-[#39A900]' : 'text-gray-800 hover:text-[#39A900]'}`}>
                      {linea.name}
                    </h3>
                    <p className={`text-sm ${secondaryText}`}>{linea.description}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditLinea(linea)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteLinea(linea.id)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'} hover:scale-110 transition`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modales */}
      {mostrarModal && (
        <ModalLinea
          mostrar={mostrarModal}
          cerrar={() => setMostrarModal(false)}
          nombre={nuevaLinea}
          descripcion={nuevaDescripcion}
          setNombre={setNuevaLinea}
          setDescripcion={setNuevaDescripcion}
          onGuardar={handleGuardar}
          modoOscuro={modoOscuro}
          editandoId={null}
        />
      )}

      {mostrarModalEditar && (
        <EditarLineaModal
          mostrar={mostrarModalEditar}
          cerrar={() => setMostrarModalEditar(false)}
          nombre={nuevaLinea}
          descripcion={nuevaDescripcion}
          setNombre={setNuevaLinea}
          setDescripcion={setNuevaDescripcion}
          onGuardar={handleGuardar}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
