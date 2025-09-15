'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
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

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Entidad Institución
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>Administra las entidades disponibles</p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar entidad..."
            className="border rounded-2xl px-5 py-3 w-full sm:w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white rounded-2xl hover:bg-[#2d8500]"
          >
            <Plus size={20} />
            Agregar Nueva Entidad
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-5">
          {filteredEntidades.map((ent) => (
            <div
              key={ent.id}
              className={`p-6 rounded-2xl border flex justify-between items-center ${cardBg} ${borderColor}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-[#39A900]/10 text-[#39A900]">
                  <FaBuilding size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{ent.name}</h3>
                  {ent.website && (
                    <p className="flex items-center gap-2 text-sm text-blue-500">
                      <FaGlobe />{' '}
                      <a href={ent.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {ent.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEntidadAEditar(ent)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-xl"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteEntidad(ent.id)}
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
