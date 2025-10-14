'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XCircle, Edit, Check, X, Trash2,
  Building2, MapPin, Phone, Globe, Users,
  FileText, User, Mail, Calendar, IdCard, ClipboardSignature,
  ArrowLeft, ArrowRight, Plus
} from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:4000/api/v1/companies';
const CITIES_URL = 'http://localhost:4000/api/v1/cities';

interface Empresa {
  id?: number;
  name: string;
  taxId?: string;
  legalName?: string;
  address?: string;
  phone?: string;
  website?: string;
  employeeCount?: number;
  economicSector?: string;
  description?: string;
  existenceYears?: number;
  legalDocument?: string;
  legalFirstName?: string;
  legalLastName?: string;
  legalRepresentativeRole?: string;
  legalRepresentativePhone?: string;
  legalRepresentativeEmail?: string;
  landline?: string;
  legalMobile?: string;
  email?: string;
  cityId?: number | null;
  city?: { id: number; name: string; department?: { id: number; name: string } };
}

interface City {
  id: number;
  name: string;
  department: { id: number; name: string };
}

export default function DatosEmpresaModal({ cerrarModal }: { cerrarModal: () => void }) {
  const { modoOscuro } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [page, setPage] = useState(0);

  // 🔹 Cerrar modal al hacer clic fuera
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) cerrarModal();
  };

  // 🧭 Cargar empresa y ciudades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('usuario');
        if (!userData) throw new Error('Usuario no autenticado');
        const user = JSON.parse(userData);

        const [resEmp, resCities] = await Promise.all([
          fetch(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          fetch(CITIES_URL)
        ]);

        const dataEmp = await resEmp.json();
        const dataCities = await resCities.json();
        setCities(dataCities.data || []);

        if (!resEmp.ok) throw new Error(dataEmp.message || 'Error al cargar empresas');

        const empresaUsuario = dataEmp.data.find((e: Empresa) => e.email === user.email);
        setEmpresa(empresaUsuario || { name: user.name || 'Nueva Empresa', email: user.email });
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 💾 Guardar campo individual
  const handleFieldSave = async (campo: keyof Empresa) => {
    if (!empresa) return;
    try {
      const payload = { [campo]: newValue };
      const res = await fetch(`${API_URL}/${empresa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setEmpresa((prev) => (prev ? { ...prev, [campo]: newValue } : prev));
      setEditingField(null);
      Swal.fire('✅ Guardado', 'Campo actualizado', 'success');
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // 🏙️ Guardar ciudad y departamento automáticamente
  useEffect(() => {
    const guardarCiudadDepto = async () => {
      if (!empresa?.id || !selectedCity) return;
      const ciudad = cities.find((c) => c.id === selectedCity);
      if (!ciudad) return;

      try {
        const payload = { cityId: ciudad.id, departmentId: ciudad.department.id };
        const res = await fetch(`${API_URL}/${empresa.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error al guardar ciudad/departamento');
        setEmpresa((prev) => (prev ? { ...prev, cityId: ciudad.id, city: ciudad } : prev));
        setSelectedDept(ciudad.department.id);
        Swal.fire('✅ Guardado', `Ciudad y departamento actualizados a ${ciudad.name}, ${ciudad.department.name}`, 'success');
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    guardarCiudadDepto();
  }, [selectedCity]);

  if (loading)
    return <div className="fixed inset-0 flex items-center justify-center bg-black/70 text-white z-50">Cargando...</div>;

  if (!empresa)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-50">
        <p>No hay empresa asociada</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          <Plus /> Crear Empresa
        </button>
      </div>
    );

  const bgHeader = modoOscuro
    ? 'bg-gradient-to-r from-[#0b1220] to-[#0a0f1a]'
    : 'bg-gradient-to-r from-[#00324D] to-[#005b8c]';

  const iconColor = "text-blue-500";

  const secciones = [
    {
      titulo: '🏢 Información General',
      campos: [
        { icon: <IdCard className={iconColor} />, label: 'NIT', field: 'taxId' },
        { icon: <FileText className={iconColor} />, label: 'Razón social', field: 'legalName' },
        { icon: <Users className={iconColor} />, label: 'Número de empleados', field: 'employeeCount' },
        { icon: <Calendar className={iconColor} />, label: 'Años de existencia', field: 'existenceYears' },
        { icon: <Globe className={iconColor} />, label: 'Sector económico', field: 'economicSector' },
        { icon: <ClipboardSignature className={iconColor} />, label: 'Descripción', field: 'description' },
      ],
    },
    {
      titulo: '📍 Ubicación y Contacto',
      campos: [
        { icon: <MapPin className={iconColor} />, label: 'Dirección', field: 'address' },
        { icon: <Phone className={iconColor} />, label: 'Teléfono móvil', field: 'phone' },
        { icon: <Mail className={iconColor} />, label: 'Correo empresarial', field: 'email' },
        { icon: <Globe className={iconColor} />, label: 'Sitio web', field: 'website' },
      ],
    },
    {
      titulo: '👤 Representante Legal',
      campos: [
        { icon: <IdCard className={iconColor} />, label: 'Documento', field: 'legalDocument' },
        { icon: <User className={iconColor} />, label: 'Nombre', field: 'legalFirstName' },
        { icon: <User className={iconColor} />, label: 'Apellido', field: 'legalLastName' },
        { icon: <ClipboardSignature className={iconColor} />, label: 'Cargo', field: 'legalRepresentativeRole' },
        { icon: <Phone className={iconColor} />, label: 'Teléfono', field: 'legalRepresentativePhone' },
        { icon: <Mail className={iconColor} />, label: 'Correo', field: 'legalRepresentativeEmail' },
      ],
    },
  ];

  const seccion = secciones[page];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={handleOutsideClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          ref={modalRef}
          className={`rounded-3xl shadow-2xl w-[96%] max-w-6xl ${modoOscuro ? 'bg-[#121826]' : 'bg-white'} p-10 relative`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button onClick={cerrarModal} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition">
            <XCircle size={34} />
          </button>

          <div className={`${bgHeader} text-white p-8 rounded-2xl mb-10`}>
            <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Building2 size={30} /> {seccion.titulo}
            </h2>
            <p className="text-center text-white/80 mt-3">{empresa.name}</p>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seccion.campos.map((campo) => (
              <motion.div
                key={campo.field}
                whileHover={{ scale: 1.03 }}
                className={`p-5 rounded-2xl border ${modoOscuro ? 'bg-[#1e293b] border-gray-700' : 'bg-gray-50 border-gray-200'} transition-all shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {campo.icon}
                  <label className="font-semibold">{campo.label}</label>
                </div>

                {editingField === campo.field ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className={`flex-grow rounded-lg p-2 ${modoOscuro ? 'bg-[#0f172a] text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500 outline-none`}
                    />
                    <button onClick={() => handleFieldSave(campo.field as keyof Empresa)} className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditingField(null)} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg text-white">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{empresa[campo.field as keyof Empresa] || '—'}</span>
                    <button
                      onClick={() => {
                        setEditingField(campo.field);
                        setNewValue((empresa[campo.field as keyof Empresa] as string) || '');
                      }}
                      className="text-blue-600 hover:text-blue-400"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}

            {page === 1 && (
              <div className={`p-5 rounded-2xl border ${modoOscuro ? 'bg-[#1e293b] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className={iconColor} />
                  <label className="font-semibold">Ciudad y Departamento</label>
                </div>
                <select
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(Number(e.target.value))}
                  className={`w-full rounded-lg p-3 ${modoOscuro ? 'bg-[#0f172a] text-gray-200' : 'bg-white text-gray-800'} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Seleccione ciudad</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} — {city.department.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center mt-12">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${page === 0 ? 'bg-gray-400/50 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <ArrowLeft /> Anterior
            </button>

            <span className="text-gray-400 font-semibold">
              Página {page + 1} de {secciones.length}
            </span>

            <button
              disabled={page === secciones.length - 1}
              onClick={() => setPage((p) => Math.min(secciones.length - 1, p + 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${page === secciones.length - 1 ? 'bg-gray-400/50 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Siguiente <ArrowRight />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
