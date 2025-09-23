'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { FaBuilding, FaGlobe } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EntidadModal from './crearEntidad';
import EditarEntidad from './editarEntidadInstitucion';
import { getInstituciones, createInstitucion, updateInstitucion, deleteInstitucion } from '../../api/entidadInstitucion/route';

interface EntidadInstitucionProps {
  modoOscuro: boolean;
}

interface Entidad {
  id: string;
  name: string;
  website: string;
}

export default function EntidadInstitucion({ modoOscuro }: EntidadInstitucionProps) {
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaEntidad, setNuevaEntidad] = useState('');
  const [nuevoSitio, setNuevoSitio] = useState('');
  const [entidadAEditar, setEntidadAEditar] = useState<Entidad | null>(null);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: mensaje, confirmButtonColor: '#39A900' });

  const showWarning = (mensaje: string) =>
    Swal.fire({ icon: 'warning', title: 'Atención', text: mensaje, confirmButtonColor: '#39A900' });

  // === CARGAR ENTIDADES ===
  const cargarEntidades = async () => {
    try {
      const data = await getInstituciones();
      setEntidades(data.data || []);
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  useEffect(() => {
    cargarEntidades();
  }, []);

  // === CREAR ===
  const handleSaveEntidad = async () => {
    if (nuevaEntidad.trim() === '') {
      showWarning('El nombre de la entidad es obligatorio');
      return;
    }
    try {
      await createInstitucion({ name: nuevaEntidad, website: nuevoSitio });
      showSuccess('La entidad fue agregada correctamente');
      setMostrarModal(false);
      setNuevaEntidad('');
      setNuevoSitio('');
      await cargarEntidades();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // === EDITAR ===
  const handleSaveEditEntidad = async (id: string, newName: string, newWebsite: string) => {
    if (newName.trim() === '') {
      showWarning('El nombre de la entidad es obligatorio');
      return;
    }
    try {
      await updateInstitucion(id, { name: newName, website: newWebsite });
      showSuccess('La entidad fue actualizada correctamente');
      setEntidadAEditar(null);
      await cargarEntidades();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  // === ELIMINAR ===
  const handleDeleteEntidad = (id: string) => {
    Swal.fire({
      title: '¿Eliminar esta entidad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteInstitucion(id);
          showSuccess('La entidad fue eliminada correctamente');
          await cargarEntidades();
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  // === FILTRO ===
  const filteredEntidades = entidades.filter(
    (ent) =>
      ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.website?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Entidad Institución
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra las entidades disponibles</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar entidad..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${textColor} ${borderColor}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
          >
            <Plus size={20} />
            Agregar Nueva Entidad
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredEntidades.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <p className={secondaryText}>No se encontraron entidades</p>
            </div>
          ) : (
            filteredEntidades.map((ent) => (
              <div
                key={ent.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex justify-between items-center transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                  <div className={`p-4 rounded-xl ${iconBg} text-[#39A900]`}>
                    <FaBuilding size={22} />
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold transition-colors ${
                        modoOscuro ? 'text-white hover:text-[#39A900]' : 'text-gray-800 hover:text-[#39A900]'
                      }`}
                    >
                      {ent.name}
                    </h3>
                    {ent.website && (
                      <p className="flex items-center gap-2 text-sm text-blue-500">
                        <FaGlobe />{' '}
                        <a
                          href={ent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {ent.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEntidadAEditar(ent)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteEntidad(ent.id)}
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
      <EntidadModal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSave={handleSaveEntidad}
        nuevaEntidad={nuevaEntidad}
        setNuevaEntidad={setNuevaEntidad}
        nuevoSitio={nuevoSitio}
        setNuevoSitio={setNuevoSitio}
        modoOscuro={modoOscuro}
      />

      {/* Modal Editar */}
      {entidadAEditar && (
        <EditarEntidad
          visible={!!entidadAEditar}
          onClose={() => setEntidadAEditar(null)}
          entidad={entidadAEditar}
          onSave={handleSaveEditEntidad}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
