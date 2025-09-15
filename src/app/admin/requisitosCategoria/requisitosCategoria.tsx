'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../api/requirementCategories/route';
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
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // === ALERTAS ===
  const showSuccess = (msg: string) =>
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: msg, confirmButtonColor: '#39A900' });
  const showWarning = (msg: string) =>
    Swal.fire({ icon: 'warning', title: 'Atención', text: msg, confirmButtonColor: '#39A900' });

  // === CARGAR ===
  const cargarCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data.data || []);
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // === CREAR ===
  const handleSaveCrear = async (nombre: string) => {
    if (!nombre.trim()) {
      showWarning('El nombre es obligatorio');
      return;
    }
    try {
      await createCategoria({ name: nombre });
      showSuccess('Categoría creada');
      setMostrarCrear(false);
      await cargarCategorias();
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  // === EDITAR ===
  const handleSaveEditar = async (id: string, nombre: string) => {
    if (!nombre.trim()) {
      showWarning('El nombre es obligatorio');
      return;
    }
    try {
      await updateCategoria(id, { name: nombre });
      showSuccess('Categoría actualizada');
      setMostrarEditar(false);
      setCategoriaSeleccionada(null);
      await cargarCategorias();
    } catch (e: any) {
      showWarning(e.message);
    }
  };

  // === ELIMINAR ===
  const handleDelete = (id: string) => {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteCategoria(id);
          showSuccess('Categoría eliminada');
          await cargarCategorias();
        } catch (e: any) {
          showWarning(e.message);
        }
      }
    });
  };

  // === FILTRO ===
  const filtered = categorias.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-5xl mx-auto my-12 ${bgColor} ${textColor}`}>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Categorías de Requisitos
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra las categorías disponibles</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar categoría..."
            className="border rounded-2xl px-5 py-3 w-full sm:w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setMostrarCrear(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-2xl hover:bg-[#2d8500]"
          >
            <Plus size={20} /> Agregar Nueva Categoría
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-2xl border flex justify-between items-center ${cardBg} ${borderColor}`}
            >
              <h3 className="font-bold">{c.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCategoriaSeleccionada(c);
                    setMostrarEditar(true);
                  }}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Crear */}
      <CrearCategoriaModal
        visible={mostrarCrear}
        onClose={() => setMostrarCrear(false)}
        onSave={handleSaveCrear}
        modoOscuro={modoOscuro}
      />

      {/* Modal Editar */}
      {categoriaSeleccionada && (
        <EditarCategoriaModal
          visible={mostrarEditar}
          onClose={() => setMostrarEditar(false)}
          categoria={categoriaSeleccionada}
          onSave={handleSaveEditar}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
