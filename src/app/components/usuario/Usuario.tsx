'use client';
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaUserTag } from 'react-icons/fa';
import ModalUsuario from './crearUsuario';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

interface UsuarioProps {
  modoOscuro: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  contraseña: string;
  telefono: string;
  estado: string;
}

export default function Usuario({ modoOscuro }: UsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nombre: 'Laura Martínez', correo: 'laura@example.com', contraseña: '123456', telefono: '3011234567', estado: 'Activo' },
    { id: '2', nombre: 'Carlos Ramírez', correo: 'carlos@example.com', contraseña: 'abcdef', telefono: '3029876543', estado: 'Inactivo' },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({ id: '', nombre: '', correo: '', contraseña: '', telefono: '', estado: 'Activo' });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const usuariosFiltrados = usuarios.filter(
    (u) => u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const abrirModal = () => {
    setMostrarModal(true);
    setNuevoUsuario({ id: '', nombre: '', correo: '', contraseña: '', telefono: '', estado: 'Activo' });
    setEditandoId(null);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoUsuario({ id: '', nombre: '', correo: '', contraseña: '', telefono: '', estado: 'Activo' });
    setEditandoId(null);
  };

  // === FUNCIONES DE ALERTAS SWEETALERT2 ===
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
      color: modoOscuro ? '#fff' : '#333'
    });
  };
  
  // 2. Lógica de guardado con alertas
  const guardarUsuario = () => {
    // Validación de campos
    if (!nuevoUsuario.nombre || !nuevoUsuario.correo || !nuevoUsuario.contraseña || !nuevoUsuario.telefono) {
      showWarning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (editandoId) {
      // Lógica para editar
      setUsuarios((prev) => prev.map((u) => (u.id === editandoId ? { ...nuevoUsuario, id: editandoId } : u)));
      showSuccess('Usuario actualizado correctamente.');
    } else {
      // Lógica para crear
      setUsuarios((prev) => [...prev, { ...nuevoUsuario, id: Date.now().toString() }]);
      showSuccess('Usuario creado exitosamente.');
    }
    cerrarModal();
  };

  const editarUsuario = (id: string) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setNuevoUsuario(usuario);
      setEditandoId(id);
      setMostrarModal(true);
    }
  };
  
  // 3. Lógica de eliminación con alerta de confirmación
  const eliminarUsuario = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
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
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        showSuccess('El usuario ha sido eliminado.');
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
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gradient-to-br from-gray-50 to-gray-100';
  const emptyStateBorder = modoOscuro ? 'border-gray-700' : 'border-gray-200';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const buttonBg = modoOscuro ? 'bg-gray-700' : 'bg-gray-200';
  const buttonText = modoOscuro ? 'text-gray-200' : 'text-gray-700';
  const buttonHover = modoOscuro ? 'hover:bg-gray-600' : 'hover:bg-gray-300';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
  const iconColor = modoOscuro ? 'text-gray-500' : 'text-gray-400';

  return (
    <>
      <div className={`rounded-3xl  p-10 max-w-9xl mx-auto my-12  ${bgColor} ${textColor} ${borderColor}`}>
        {/* ... (resto del JSX que ya tenías, no necesita cambios) ... */}
         {/* Cabecera con efecto gradiente */}
         <div className="text-center mb-10 relative z-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${modoOscuro ? 'text-white' : ''}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Usuarios
            </span>
          </h2>
          <p className={`text-lg ${secondaryText} max-w-2xl mx-auto`}>
            Administra los usuarios del sistema de forma sencilla y eficiente
          </p>
        </div>

        {/* Buscador y botón con mejoras */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 relative z-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md pl-12 ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <svg
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white text-lg font-medium rounded-2xl hover:shadow-xl transition-all duration-300 hover:brightness-110 transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto justify-center relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2d8500] to-[#39A900] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">Agregar Usuario</span>
          </button>
        </div>

        {/* Lista de usuarios mejorada */}
        <div className="space-y-5 relative z-10">
          {usuariosFiltrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border transition-colors duration-500 ${emptyStateBg} ${emptyStateBorder}`}>
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${modoOscuro ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <svg className={`w-12 h-12 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className={`${secondaryText} text-lg`}>No se encontraron usuarios</p>
              <button
                onClick={abrirModal}
                className={`mt-4 px-5 py-2 rounded-lg transition-colors duration-300 ${buttonBg} ${buttonText} ${buttonHover}`}
              >
                Crear nuevo usuario
              </button>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div 
                key={usuario.id} 
                className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 group ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]/50'}`}
              >
                {/* Info usuario con mejoras */}
                <div className="flex items-start gap-4 w-full">
                  <div className={`p-4 rounded-xl flex items-center justify-center h-14 w-14 transition-all duration-300 group-hover:rotate-6 ${iconBg} ${modoOscuro ? 'text-[#39A900] hover:bg-[#39A900]/30' : 'text-[#39A900] hover:bg-[#39A900]/20'}`}>
                    <FaUserTag size={28} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className={`text-xl font-semibold transition-colors duration-300 ${modoOscuro ? 'group-hover:text-[#39A900] text-white' : 'group-hover:text-[#39A900] text-gray-800'}`}>
                      {usuario.nombre}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p className={`${detailText} flex items-center gap-2`}>
                        <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {usuario.correo}
                      </p>
                      <p className={`${detailText} flex items-center gap-2`}>
                        <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        {usuario.telefono}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.estado === 'Activo' 
                          ? modoOscuro 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-green-100 text-green-800'
                          : modoOscuro 
                            ? 'bg-red-900/30 text-red-400' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones acción mejorados */}
                <div className="flex gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => editarUsuario(usuario.id)}
                    title="Editar usuario"
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center h-12 w-12 group/edit ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} className="group-hover/edit:animate-pulse" />
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    title="Eliminar usuario"
                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center h-12 w-12 group/delete ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={20} className="group-hover/delete:animate-wiggle" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <ModalUsuario
          nuevoUsuario={nuevoUsuario}
          editandoId={editandoId}
          manejarCambio={manejarCambio}
          cerrarModal={cerrarModal}
          guardarUsuario={guardarUsuario}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}