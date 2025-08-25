'use client';

import { useState } from 'react';
import { 
  Plus, Edit, Trash2, Briefcase, Building2, Hash, MapPin, Globe, Phone, Users, Factory,
  Clock, UserCheck, Scale, Mail, Smartphone, FileBadge
} from 'lucide-react';
import EmpresaModal from './crearEmpresa';
import Swal from 'sweetalert2';

interface EmpresaProps {
  modoOscuro: boolean;
}

interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  razonSocial: string;
  paginaWeb: string;
  telefono: string;
  empleados: string;
  sector: string;
  tiempo: string;
  descripcion: string;
  documentoLegal: string;
  nombreLegal: string;
  apellidoLegal: string;
  telefonoFijo: string;
  celular: string;
  email: string;
  cargoLegal: string;
  ciudad: string;
}

const emptyEmpresa: Empresa = {
  id: '', nombre: '', nit: '', direccion: '', razonSocial: '', paginaWeb: '', telefono: '', empleados: '',
  sector: '', tiempo: '', descripcion: '', documentoLegal: '', nombreLegal: '', apellidoLegal: '', telefonoFijo: '',
  celular: '', email: '', cargoLegal: '', ciudad: '',
};

export default function Empresa({ modoOscuro }: EmpresaProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: '1', nombre: 'Tech Solutions S.A.', nit: '800123456-7', direccion: 'Calle 100 # 25-50',
      razonSocial: 'Servicios Tecnológicos', paginaWeb: 'https://techsolutions.com', telefono: '1234567',
      empleados: '50', sector: 'Tecnología', tiempo: '5 años',
      descripcion: 'Empresa dedicada al desarrollo de software empresarial.',
      documentoLegal: 'Certificado Cámara de Comercio', nombreLegal: 'Carlos', apellidoLegal: 'Gómez',
      telefonoFijo: '1234567', celular: '3216549870', email: 'contacto@techsolutions.com',
      cargoLegal: 'Representante Legal', ciudad: 'Bogotá',
    },
    {
      id: '2', nombre: 'AgroVerde Ltda.', nit: '900987654-3', direccion: 'Carrera 12 # 45-67',
      razonSocial: 'Agroindustria Sostenible', paginaWeb: 'https://agroverde.co', telefono: '604123456',
      empleados: '120', sector: 'Agroindustria', tiempo: '10 años',
      descripcion: 'Empresa enfocada en el desarrollo de soluciones sostenibles para el sector agrícola.',
      documentoLegal: 'Certificado Cámara de Comercio', nombreLegal: 'Luisa', apellidoLegal: 'Martínez',
      telefonoFijo: '604123456', celular: '3109876543', email: 'contacto@agroverde.co',
      cargoLegal: 'Gerente General', ciudad: 'Medellín',
    },
  ]);

  const [buscar, setBuscar] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [empresaActual, setEmpresaActual] = useState<Empresa>(emptyEmpresa);

  const empresasFiltradas = empresas.filter((e) =>
    e.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    e.nit.toLowerCase().includes(buscar.toLowerCase())
  );
  
  const abrirModal = (empresa?: Empresa) => {
    if (empresa) {
      setEditandoId(empresa.id);
      setEmpresaActual(empresa);
    } else {
      setEditandoId(null);
      setEmpresaActual(emptyEmpresa);
    }
    setMostrarModal(true);
  };
  
  const cerrarModal = () => {
    setEditandoId(null);
    setEmpresaActual(emptyEmpresa);
    setMostrarModal(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmpresaActual({ ...empresaActual, [e.target.name]: e.target.value });
  };
  
  const showSuccess = (mensaje: string) => {
    Swal.fire({
      icon: 'success', title: '¡Éxito!', text: mensaje,
      confirmButtonText: 'Aceptar', confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff', color: modoOscuro ? '#fff' : '#333',
      timer: 2000, timerProgressBar: true,
    });
  };

  const showWarning = (mensaje: string) => {
    Swal.fire({
      icon: 'warning', title: 'Atención', text: mensaje,
      confirmButtonText: 'Aceptar', confirmButtonColor: '#39A900',
      background: modoOscuro ? '#1a0526' : '#fff', color: modoOscuro ? '#fff' : '#333',
    });
  };

  const handleSave = () => {
    if (!empresaActual.nombre.trim() || !empresaActual.nit.trim()) {
      showWarning('El nombre y el NIT de la empresa son campos obligatorios.');
      return;
    }

    if (editandoId) {
      setEmpresas(empresas.map((e) => (e.id === editandoId ? empresaActual : e)));
      showSuccess('Empresa actualizada correctamente.');
    } else {
      const nueva = { ...empresaActual, id: Date.now().toString() };
      setEmpresas([...empresas, nueva]);
      showSuccess('Empresa creada exitosamente.');
    }
    cerrarModal();
  };
  
  const handleEliminar = (id: string) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta empresa?',
      text: "Esta acción no se puede deshacer.", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6', confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar', background: modoOscuro ? '#1a0526' : '#fff',
      color: modoOscuro ? '#fff' : '#333',
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpresas(empresas.filter((e) => e.id !== id));
        showSuccess('La empresa ha sido eliminada.');
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
  const emptyStateBg = modoOscuro ? 'bg-gray-800/30' : 'bg-gray-50/50';
  const emptyStateBorder = modoOscuro ? 'border-gray-700' : 'border-dashed border-gray-200';
  const secondaryText = modoOscuro ? 'text-gray-300' : 'text-gray-600';
  const titleColor = modoOscuro ? 'text-white' : 'text-gray-800';
  const detailText = modoOscuro ? 'text-gray-400' : 'text-gray-600';
  const borderLight = modoOscuro ? 'border-gray-700' : 'border-gray-200';
  const iconColor = modoOscuro ? 'text-[#39A900]' : 'text-[#39A900]';
  const iconBg = modoOscuro ? 'bg-[#39A900]/20' : 'bg-[#39A900]/10';
  const linkColor = modoOscuro ? 'text-[#39A900] hover:text-[#2d8500]' : 'text-[#39A900] hover:text-[#2d8500]';

  return (
    <>
      <div className={`rounded-3xl  p-10 max-w-9xl mx-auto my-12  ${bgColor} ${textColor} ${borderColor}`}>
        {/* Título principal */}
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>
            Gestión de Empresas
          </h2>
          <p className={`text-lg ${secondaryText}`}>
            Administra la información de las empresas registradas
          </p>
        </div>

        {/* Buscador + botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Buscar empresa por nombre o NIT..."
            className={`border rounded-2xl px-5 py-3 text-lg focus:outline-none focus:ring-2 w-full sm:w-96 transition-all duration-300 hover:shadow-md ${searchBg} ${textColor} ${searchBorder} ${searchFocus} ${placeholderColor}`}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
         <button
      className="flex items-center gap-2 px-6 py-3 bg-[#39A900] text-white text-lg font-medium rounded-2xl 
                 hover:bg-[#2d8500] transition-all shadow-md hover:shadow-xl transform hover:scale-105 
                 duration-300 w-full sm:w-auto justify-center"
      onClick={() => abrirModal()}
    >
      <Plus size={20} />
      Agregar Empresa
    </button>
        </div>

        {/* Lista de empresas */}
        <div className="space-y-6">
          {empresasFiltradas.length === 0 ? (
            <div className={`text-center py-20 rounded-2xl border ${emptyStateBg} ${emptyStateBorder}`}>
              <p className={`${secondaryText} text-lg`}>
                {buscar
                  ? `No se encontraron empresas que coincidan con "${buscar}"`
                  : 'Aún no hay empresas registradas'}
              </p>
            </div>
          ) : (
            empresasFiltradas.map((empresa) => (
              <div
                key={empresa.id}
                className={`p-6 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col sm:flex-row items-start gap-6 ${cardBg} ${borderColor} ${modoOscuro ? 'hover:border-[#39A900]/50' : 'hover:border-[#39A900]'}`}
              >
                {/* Contenido principal de la tarjeta */}
                <div className="flex-1 space-y-4">
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${iconBg}`}>
                      <Briefcase size={28} className={iconColor} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold transition-colors ${titleColor}`}>
                        {empresa.nombre}
                      </h3>
                      <p className={`text-sm ${secondaryText}`}>{empresa.razonSocial}</p>
                    </div>
                  </div>
                  {/* Descripción */}
                  <p className={`text-md ${detailText} pl-3 border-l-4 ${borderLight}`}>
                    {empresa.descripcion || 'No hay una descripción disponible.'}
                  </p>

                  {/* Detalles de la empresa */}
                  <div className={`pt-4 border-t ${borderColor}`}>
                    <h4 className={`font-semibold mb-3 text-sm tracking-wider uppercase ${secondaryText}`}>Detalles de la Empresa</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      <p className="flex items-center gap-3"><Hash size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>NIT:</span> {empresa.nit}</p>
                      <p className="flex items-center gap-3"><Factory size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Sector:</span> {empresa.sector}</p>
                      <p className="flex items-center gap-3"><Users size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Empleados:</span> {empresa.empleados}</p>
                      <p className="flex items-center gap-3"><MapPin size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Dirección:</span> {empresa.direccion}</p>
                      <p className="flex items-center gap-3"><Building2 size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Ciudad:</span> {empresa.ciudad}</p>
                      <p className="flex items-center gap-3"><Clock size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Antigüedad:</span> {empresa.tiempo}</p>
                    </div>
                  </div>

                  {/* Contacto y Representante Legal */}
                  <div className={`pt-4 border-t ${borderColor}`}>
                    <h4 className={`font-semibold mb-3 text-sm tracking-wider uppercase ${secondaryText}`}>Contacto y Representante Legal</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                      <p className="flex items-center gap-3"><UserCheck size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Rep. Legal:</span> {empresa.nombreLegal} {empresa.apellidoLegal}</p>
                      <p className="flex items-center gap-3"><Scale size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Cargo:</span> {empresa.cargoLegal}</p>
                      <p className="flex items-center gap-3"><FileBadge size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Doc. Legal:</span> {empresa.documentoLegal}</p>
                      <p className="flex items-center gap-3"><Mail size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Email:</span> {empresa.email}</p>
                      <p className="flex items-center gap-3"><Smartphone size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Celular:</span> {empresa.celular}</p>
                      <p className="flex items-center gap-3"><Phone size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Teléfono:</span> {empresa.telefonoFijo || empresa.telefono}</p>
                      <p className="flex items-center gap-3 col-span-full"><Globe size={16} className={iconColor}/> <span className={`font-semibold ${textColor}`}>Página Web:</span> <a href={empresa.paginaWeb} target="_blank" rel="noopener noreferrer" className={`${linkColor} hover:underline`}>{empresa.paginaWeb}</a></p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-3 self-start sm:self-center">
                  <button
                    onClick={() => abrirModal(empresa)}
                    title="Editar empresa"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleEliminar(empresa.id)}
                    title="Eliminar empresa"
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center h-12 w-12 ${modoOscuro ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear/editar empresa */}
       {/* Modal para crear/editar empresa */}
   {mostrarModal && (
  <EmpresaModal
    isOpen={mostrarModal}
    onClose={cerrarModal}
    onSave={handleSave}
    empresa={empresaActual}
    onChange={handleChange}
    modoOscuro={modoOscuro}
  />
)}
    </>
  );
}