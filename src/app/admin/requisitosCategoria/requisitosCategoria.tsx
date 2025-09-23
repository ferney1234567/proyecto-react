'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { FaTag } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../../api/requirementCategories/route';
import CrearCategoriaModal from './crearCategoria';
import EditarCategoriaModal from './editarCategoria';

interface CategoriaProps {
  modoOscuro: boolean;
}

interface Categoria {
  id: string;
  name: string;
}

export default function Categoria({ modoOscuro }: CategoriaProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // === ALERTAS ===
  const showSuccess = (msg: string) =>
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: msg,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  const showWarning = (msg: string) =>
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: msg,
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    });

  // === CARGAR ===
  const cargarCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(
        (data.data || []).map((c: any) => ({
          id: String(c.id),
          name: c.name || 'Sin nombre',
        }))
      );
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // === CREAR ===
  const handleGuardarCrear = async (nombre: string) => {
    if (!nombre.trim()) {
      showWarning('El nombre de la categoría es obligatorio');
      return;
    }
    try {
      await createCategoria({ name: nombre });
      showSuccess('Categoría creada correctamente');
      setMostrarModal(false);
      await cargarCategorias();
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  // === EDITAR ===
  const handleGuardarEditar = async (id: string, nombre: string) => {
    if (!nombre.trim()) {
      showWarning('El nombre de la categoría es obligatorio');
      return;
    }
    try {
      await updateCategoria(id, { name: nombre });
      showSuccess('Categoría actualizada correctamente');
      setMostrarModalEditar(false);
      setCategoriaSeleccionada(null);
      await cargarCategorias();
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  // === ELIMINAR ===
  const handleDelete = (id: string) => {
    Swal.fire({
      title: '¿Eliminar esta categoría?',
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
          await deleteCategoria(id);
          await cargarCategorias();
          showSuccess('Categoría eliminada');
        } catch (e: any) {
          showWarning(e.message);
        }
      }
    });
  };

  // === EDITAR ===
  const handleEdit = (cat: Categoria) => {
    setCategoriaSeleccionada(cat);
    setMostrarModalEditar(true);
  };

  // === NUEVA ===
  const handleAdd = () => {
    setCategoriaSeleccionada(null);
    setMostrarModal(true);
  };

  // === FILTRO ===
  const filtered = categorias.filter((c) =>
    (c?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === ESTILOS ===
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

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Categorías
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra las categorías de requisitos</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar categorías..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Nueva Categoría
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filtered.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron categorías</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                    <FaTag />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        modoOscuro ? 'text-white hover:text-[#39A900]' : 'text-gray-800 hover:text-[#39A900]'
                      }`}
                    >
                      {c?.name ?? 'Sin nombre'}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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

      {/* Modal Crear */}
      {mostrarModal && (
        <CrearCategoriaModal
          visible={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardarCrear}
          modoOscuro={modoOscuro}
        />
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && categoriaSeleccionada && (
        <EditarCategoriaModal
          visible={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          categoria={categoriaSeleccionada}
          onSave={handleGuardarEditar}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
