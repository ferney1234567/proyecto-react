'use client';
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { FaUserTag } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ModalUsuario from './crearUsuario';
import EditarUsuario from './EditarUsuario';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/usuarios/route';

interface UsuarioProps {
  modoOscuro: boolean;
}

export interface Usuario {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  is_active: boolean;
  role_id?: number | null;
}

export default function Usuario({ modoOscuro }: UsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({
    id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    is_active: true,
    role_id: null,
  });
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  // === ALERTAS ===
  const showSuccess = (mensaje: string) =>
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      confirmButtonColor: '#39A900',
      timer: 2000,
      timerProgressBar: true,
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

  // === CRUD API ===
  const cargarUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const guardarUsuario = async () => {
    if (!nuevoUsuario.name || !nuevoUsuario.email || !nuevoUsuario.password || !nuevoUsuario.phone) {
      showWarning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      await createUser(nuevoUsuario);
      showSuccess('Usuario creado exitosamente.');
      await cargarUsuarios();
      cerrarModalCrear();
    } catch (error: any) {
      showWarning(error.message);
    }
  };

  const editarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModalEditar(true);
  };

  const cerrarModalCrear = () => {
    setMostrarModalCrear(false);
    setNuevoUsuario({ id: '', name: '', email: '', password: '', phone: '', is_active: true, role_id: null });
  };

  const cerrarModalEditar = () => {
    setUsuarioEditando(null);
    setMostrarModalEditar(false);
  };

  const eliminarUsuario = (id: string) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          await cargarUsuarios();
          showSuccess('Usuario eliminado correctamente.');
        } catch (error: any) {
          showWarning(error.message);
        }
      }
    });
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // === ESTILOS ===
  const bgColor = modoOscuro ? 'bg-[#1a0526]' : 'bg-white';
  const textColor = modoOscuro ? 'text-white' : 'text-gray-900';
  const borderColor = modoOscuro ? 'border-white/20' : 'border-gray-200';
  const cardBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
  const iconColor = modoOscuro ? 'text-gray-500' : 'text-gray-400';
  const searchBg = modoOscuro ? 'bg-white/10' : 'bg-white';
  const searchBorder = modoOscuro ? 'border-white/20' : 'border-gray-300';
  const searchFocus = 'focus:ring-[#39A900] focus:border-[#39A900]';
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50';
  const emptyStateBorder = modoOscuro ? 'border-gray-700' : 'border-gray-200';

  return (
    <>
      <div className={`rounded-3xl p-10 max-w-9xl mx-auto my-12 ${bgColor} ${textColor}`}>
        {/* Cabecera */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Gestión de Usuarios
            </span>
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra los usuarios del sistema de forma sencilla y eficiente
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className={`border rounded-2xl px-5 py-3 text-lg pl-12 focus:outline-none focus:ring-2 w-full transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus}`}
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
            onClick={() => setMostrarModalCrear(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white text-lg font-medium rounded-2xl hover:shadow-xl transition-all duration-300 hover:brightness-110 transform hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            Agregar Usuario
          </button>
        </div>

        {/* Lista usuarios */}
        <div className="space-y-5">
          {usuariosFiltrados.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${emptyStateBg} ${emptyStateBorder}`}>
              <p className={`${secondaryText} text-lg`}>No se encontraron usuarios</p>
              <button
                onClick={() => setMostrarModalCrear(true)}
                className="mt-4 px-5 py-2 rounded-lg bg-[#39A900]/10 text-[#39A900] hover:bg-[#39A900]/20 transition"
              >
                Crear nuevo usuario
              </button>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transform hover:-translate-y-1 ${cardBg} ${borderColor}`}
              >
                <div className="flex items-start gap-4 w-full">
                  <div className={`p-4 rounded-xl ${iconBg} text-[#39A900]`}>
                    <FaUserTag size={28} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3
                      className={`text-xl font-semibold transition-colors ${
                        modoOscuro ? 'text-white hover:text-[#39A900]' : 'text-gray-800 hover:text-[#39A900]'
                      }`}
                    >
                      {usuario.name}
                    </h3>
                    <p className={detailText}>{usuario.email}</p>
                    <p className={detailText}>{usuario.phone}</p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.is_active
                          ? modoOscuro
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : modoOscuro
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {usuario.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    onClick={() => editarUsuario(usuario)}
                    className={`p-3 rounded-xl ${modoOscuro ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} hover:scale-110 transition`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
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
        <ModalUsuario
          nuevoUsuario={nuevoUsuario}
          manejarCambio={(e: any) => setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value })}
          cerrarModal={cerrarModalCrear}
          guardarUsuario={guardarUsuario}
          modoOscuro={modoOscuro}
          editandoId={null}
        />
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && usuarioEditando && (
        <EditarUsuario
          usuario={usuarioEditando}
          onClose={cerrarModalEditar}
          actualizarUsuario={async (usuarioEditado: Usuario) => {
            await updateUser(usuarioEditado.id, usuarioEditado);
            await cargarUsuarios();
            cerrarModalEditar();
            showSuccess('Usuario actualizado correctamente.');
          }}
          modoOscuro={modoOscuro}
        />
      )}
    </>
  );
}
