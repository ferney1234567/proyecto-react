'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import Swal from 'sweetalert2';
import ModalRol from './crearRol';
import ModalEditarRol from './editarRol';
import { getRoles, createRole, updateRole, deleteRole } from '../../api/roles/route';

interface RolProps {
  modoOscuro: boolean;
}

interface Role {
  id: string;
  name: string;
}

export default function Rol({ modoOscuro }: RolProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [nuevoRol, setNuevoRol] = useState('');
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [rolParaEditar, setRolParaEditar] = useState<Role | null>(null);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
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
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333'
    });
  };

  // ==================== CRUD ====================

  const cargarRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const handleSaveRole = async () => {
    if (nuevoRol.trim() === '') {
      showWarning('El nombre del rol es obligatorio');
      return;
    }
    try {
      await createRole(nuevoRol);
      await cargarRoles();
      cerrarModalCrear();
      showSuccess('El rol fue agregado correctamente');
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  const handleUpdateRole = async (id: string, newName: string) => {
    if (newName.trim() === '') {
      showWarning('El nombre del rol no puede estar vacío.');
      return;
    }
    try {
      await updateRole(id, newName);
      await cargarRoles();
      cerrarModalEditar();
      showSuccess('El rol fue actualizado correctamente');
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  const handleDeleteRole = (id: string) => {
    Swal.fire({
      title: '¿Eliminar este rol?',
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
          await deleteRole(id);
          await cargarRoles();
          showSuccess('El rol fue eliminado correctamente');
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  // ==================== Modales ====================
  const handleAddRole = () => setMostrarModalCrear(true);
  const cerrarModalCrear = () => { setMostrarModalCrear(false); setNuevoRol(''); };

  const handleEditRole = (id: string) => {
    const rol = roles.find(r => r.id === id);
    if (rol) {
      setRolParaEditar(rol);
      setMostrarModalEditar(true);
    }
  };
  const cerrarModalEditar = () => { setMostrarModalEditar(false); setRolParaEditar(null); };

  // ==================== FILTRO ====================
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

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
              Gestión de Roles
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los roles del sistema
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar roles..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={roleSearchTerm}
            onChange={(e) => setRoleSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddRole}
            className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Agregar Nuevo Rol
          </button>
        </div>

        {/* Lista de roles */}
        <div className="space-y-5">
          {filteredRoles.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron roles</p>
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div key={role.id} className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}>
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                    <User size={24} />
                  </div>
                  <h3 className={`text-xl font-semibold ${modoOscuro ? 'text-white hover:text-[#39A900]' : 'text-gray-800 hover:text-[#39A900]'}`}>
                    {role.name}
                  </h3>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditRole(role.id)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
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
      {mostrarModalCrear && (
        <ModalRol
          nuevoRol={nuevoRol}
          setNuevoRol={setNuevoRol}
          onClose={cerrarModalCrear}
          onSave={handleSaveRole}
          modoOscuro={modoOscuro}
        />
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && rolParaEditar && (
        <ModalEditarRol
          rol={rolParaEditar}
          onClose={cerrarModalEditar}
          onSave={handleUpdateRole}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
