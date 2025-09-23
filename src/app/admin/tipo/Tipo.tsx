"use client";
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaClipboardCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  getRequirementGroups,
  createRequirementGroup,
  updateRequirementGroup,
  deleteRequirementGroup,
} from '../../api/tipoRequisitos/routes';
import ModalCrearGrupo from './crearTipo';
import ModalEditarGrupo from './editarTipo';

interface TipoProps {
  modoOscuro: boolean;
}

interface RequirementGroup {
  id: number;
  name: string;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
}

interface Category {
  id: number;
  name: string;
}

export default function Tipo({ modoOscuro }: TipoProps) {
  const [tipos, setTipos] = useState<RequirementGroup[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [tipoSearchTerm, setTipoSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // === Cargar datos desde la API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await fetch('http://localhost:4000/api/v1/requirementCategories');
        if (!categoriasRes.ok) throw new Error('Error cargando categorías');
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.data || []);

        const gruposRes = await getRequirementGroups();
        const gruposMapped = (gruposRes || []).map((g: any) => {
          const categoriaEncontrada = categoriasData.data.find(
            (c: Category) => c.id === g.categoryId
          );
          return {
            id: g.id,
            name: g.name,
            categoryId: g.categoryId,
            category: categoriaEncontrada || null,
          };
        });
        setTipos(gruposMapped);
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los grupos/categorías', 'error');
      }
    };
    fetchData();
  }, []);

  // === Crear grupo ===
  const handleCrearGrupo = async () => {
    if (!nuevoTipo.trim() || !categoriaId) {
      Swal.fire('Atención', 'Debes ingresar un nombre y seleccionar una categoría', 'warning');
      return;
    }
    try {
      const creado = await createRequirementGroup(nuevoTipo, categoriaId);
      const categoria = categorias.find((c) => c.id === creado.categoryId) || null;
      setTipos([...tipos, { ...creado, category: categoria }]);
      setMostrarModal(false);
      setNuevoTipo('');
      setCategoriaId(null);
      Swal.fire('Éxito', 'Grupo creado correctamente', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // === Editar grupo ===
  const handleEditarGrupo = async (id: number) => {
    if (!nuevoTipo.trim() || !categoriaId) {
      Swal.fire('Atención', 'Debes ingresar un nombre y seleccionar una categoría', 'warning');
      return;
    }
    try {
      const actualizado = await updateRequirementGroup(id, nuevoTipo, categoriaId);
      const categoria = categorias.find((c) => c.id === actualizado.categoryId) || null;
      setTipos(
        tipos.map((g) =>
          g.id === id ? { ...actualizado, category: categoria } : g
        )
      );
      setMostrarModal(false);
      setEditandoId(null);
      setNuevoTipo('');
      setCategoriaId(null);
      Swal.fire('Éxito', 'Grupo actualizado correctamente', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // === Eliminar grupo ===
  const handleEliminarGrupo = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar grupo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteRequirementGroup(id);
      setTipos(tipos.filter((g) => g.id !== id));
      Swal.fire('Éxito', 'Grupo eliminado correctamente', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // === FILTRO ===
  const filteredTipos = tipos.filter(
    (tipo) =>
      tipo.name.toLowerCase().includes(tipoSearchTerm.toLowerCase()) ||
      tipo.category?.name.toLowerCase().includes(tipoSearchTerm.toLowerCase())
  );

  // === Estilos ===
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
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Grupos de Requisitos
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los grupos de requisitos y sus categorías
          </p>
        </div>

        {/* Buscador + Botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar grupos o categorías..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={tipoSearchTerm}
            onChange={(e) => setTipoSearchTerm(e.target.value)}
          />
          <button
            onClick={() => {
              setEditandoId(null);
              setNuevoTipo('');
              setCategoriaId(null);
              setMostrarModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Nuevo Grupo
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredTipos.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron grupos</p>
            </div>
          ) : (
            filteredTipos.map((grupo) => (
              <div
                key={grupo.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                {/* Icono + info */}
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-4 rounded-xl flex items-center justify-center h-12 w-12 ${iconBg} text-[#39A900]`}>
                    <FaClipboardCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{grupo.name}</h3>
                    <p className={`text-sm ${secondaryText}`}>
                      Categoría: {grupo.category?.name || 'Sin categoría'}
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditandoId(grupo.id);
                      setNuevoTipo(grupo.name);
                      setCategoriaId(grupo.category?.id || null);
                      setMostrarModal(true);
                    }}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminarGrupo(grupo.id)}
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
      {mostrarModal && !editandoId && (
        <ModalCrearGrupo
          abierto={mostrarModal}
          valor={nuevoTipo}
          categoriaId={categoriaId}
          categorias={categorias}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={handleCrearGrupo}
          onCambioNombre={setNuevoTipo}
          onCambioCategoria={setCategoriaId}
          modoOscuro={modoOscuro}
        />
      )}

      {mostrarModal && editandoId && (
        <ModalEditarGrupo
          abierto={mostrarModal}
          valor={nuevoTipo}
          categoriaId={categoriaId}
          categorias={categorias}
          onCerrar={() => setMostrarModal(false)}
          onGuardar={() => handleEditarGrupo(editandoId)}
          onCambioNombre={setNuevoTipo}
          onCambioCategoria={setCategoriaId}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
