'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import Swal from 'sweetalert2';
import ModalRol from './crearRol';

interface RolProps {
  modoOscuro: boolean;
}

interface Role {
  id: string;
  name: string;
}

export default function Rol({ modoOscuro }: RolProps) {
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'Administrador' },
    { id: '2', name: 'Editor' },
  ]);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoRol, setNuevoRol] = useState('');

  // === ALERTAS SWEETALERT2 ===
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

  const handleAddRole = () => setMostrarModal(true);

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoRol('');
  };

  const handleSaveRole = () => {
    if (nuevoRol.trim() === '') {
      showWarning('El nombre del rol es obligatorio');
      return;
    }
    const nuevo: Role = {
      id: Date.now().toString(),
      name: nuevoRol,
    };
    setRoles([...roles, nuevo]);
    cerrarModal();
    showSuccess('El rol fue agregado correctamente');
  };

  const handleEditRole = (id: string) => {
    const rol = roles.find(r => r.id === id);
    if (!rol) return;

    Swal.fire({
      title: 'Editar rol',
      input: 'text',
      inputValue: rol.name,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setRoles(roles.map(r => r.id === id ? { ...r, name: result.value } : r));
        showSuccess('El rol fue actualizado correctamente');
      }
    });
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
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter(r => r.id !== id));
        showSuccess('El rol fue eliminado correctamente');
      }
    });
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  // Estilos condicionales
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
    {/* Contenedor principal */}
    <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
          Gestión de Roles
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
            <p className={`${secondaryText} text-lg`}>
              No se encontraron roles
            </p>
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div 
              key={role.id} 
              className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor} ${
                modoOscuro 
                  ? 'hover:border-[#39A900]/50' 
                  : 'hover:border-[#39A900]'
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`p-4 rounded-xl transition-colors ${iconBg} text-[#39A900]`}>
                  <User size={24} />
                </div>
                <h3 className={`text-xl font-semibold transition-colors ${
                  modoOscuro ? 'hover:text-[#39A900] text-white' : 'hover:text-[#39A900] text-gray-800'
                }`}>
                  {role.name}
                </h3>
              </div>

              {/* Botones acción */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditRole(role.id)}
                  title="Editar rol"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                    modoOscuro
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  title="Eliminar rol"
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                    modoOscuro
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Modal */}
    {mostrarModal && (
      <ModalRol
        nuevoRol={nuevoRol}
        setNuevoRol={setNuevoRol}
        onClose={cerrarModal}
        onSave={handleSaveRole}
        modoOscuro={modoOscuro}
      />
    )}
  </>
);
}
