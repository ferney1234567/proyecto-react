'use client';

import {
  FaBuilding, FaMapMarkedAlt, FaPhone, FaGlobe, FaUsers, FaCity, FaLayerGroup,
  FaLaptopCode, FaArrowLeft, FaEdit, FaCheck, FaTimes, FaPlus, FaMinus, FaQuoteRight
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PerfilEmpresa() {
  const router = useRouter();
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  // Estado unificado para todos los datos del perfil
  const [profileData, setProfileData] = useState({
    nombre: 'Tattas Consultancy S.A',
    lema: '“Construya sobre la creencia”',
    nit: '1054399191-67',
    logo: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    especialidades: ['Ing Sistemas', 'Ing Química', 'Ing en Minas', 'Ing Civil', 'Ing Electrónica'],
    razonSocial: 'Tata Consultancy Services',
    direccion: 'Crr 25 #24 A #5',
    departamento: 'Caldas',
    telefono: '01800 808008',
    numEmpleados: '+10.000',
    ciudad: 'Manizales',
    paginaWeb: 'tataconsultancy.com',
    sector: 'Tecnología de la información (TI)',
    descripcion: 'Tata Consultancy Services (TCS) es una empresa global de servicios de TI, consultoría y soluciones empresariales. Se dedica a ayudar a las empresas a transformar sus operaciones a través de servicios integrados y un enfoque en la innovación y la sostenibilidad...'
  });

  // --- Lógica de Edición ---
  const handleEditClick = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setEditedValue(currentValue);
  };
  const handleCancel = () => setEditingField(null);
  const handleSave = () => {
    if (!editingField) return;

    if (String(editingField).startsWith('especialidad-')) {
      const index = parseInt(String(editingField).split('-')[1], 10);
      const nuevasEspecialidades = [...profileData.especialidades];
      nuevasEspecialidades[index] = editedValue;
      setProfileData(prev => ({ ...prev, especialidades: nuevasEspecialidades }));
    } else {
      setProfileData(prev => ({ ...prev, [editingField]: editedValue }));
    }
    setEditingField(null);
  };
  
  // --- Lógica de Especialidades ---
  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setProfileData(prev => ({ ...prev, especialidades: [...prev.especialidades, newSpecialty.trim()] }));
      setNewSpecialty('');
    }
  };
  const removeSpecialty = (index) => {
    setProfileData(prev => ({ ...prev, especialidades: prev.especialidades.filter((_, i) => i !== index) }));
  };

  // --- Componente de Campo de Información (Estilo Refinado) ---
  const InfoField = ({ icon, label, fieldKey }) => (
    <div className="relative group flex items-start gap-5">
      <div className="text-3xl text-[#00324D] w-10 text-center mt-1">{icon}</div>
      <div className="flex-grow">
        <span className="font-bold text-slate-600 block text-base">{label}</span>
        {editingField === fieldKey ? (
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="text" 
              value={editedValue} 
              onChange={(e) => setEditedValue(e.target.value)} 
              className="border-2 border-[#00324D] rounded-lg px-3 py-2 w-full text-base focus:ring-2 focus:ring-[#00324D] focus:outline-none" 
              autoFocus 
            />
            <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"><FaCheck size={16}/></button>
            <button onClick={handleCancel} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"><FaTimes size={16}/></button>
          </div>
        ) : (
          <span className="inline-block bg-[#00324D]/10 text-[#00324D] px-4 py-2 rounded-lg text-base font-medium mt-1">
            {profileData[fieldKey]}
          </span>
        )}
      </div>
      {editingField !== fieldKey && (
        <button onClick={() => handleEditClick(fieldKey, profileData[fieldKey])} className="absolute right-0 top-1 text-slate-400 hover:text-[#00324D] opacity-0 group-hover:opacity-100 transition-opacity">
          <FaEdit size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto my-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* --- HEADER CON LOGO PRIMERO --- */}
      <header className="bg-gradient-to-b from-[#00324D] to-[#001a27] text-white p-2 text-center relative pb-12">

        {/* Botón de regreso */}
        <div className="flex justify-start mt-6">
  <button 
    onClick={() => router.push('/menu')} 
    className="bg-white/10 rounded-full hover:bg-white/20 transition-colors p-3 ml-4"
  >
    <FaArrowLeft size={18} />
  </button>
</div>

       <div className="relative inline-block -mt-12">
  <div className="w-40 h-40 rounded-full border-[6px] border-white bg-white shadow-xl overflow-hidden mx-auto">
    <img 
      src={profileData.logo} 
      alt="Logo" 
      className="w-full h-full object-cover"
    />
  </div>
</div>

        {/* Información de la empresa debajo del logo */}
        <div className="flex flex-col items-center space-y-4">
          {/* 1. Nombre de la empresa */}
          <div className="relative group">
            {editingField === 'nombre' ? ( 
              <div className="flex items-center gap-1">
                <input 
                  type="text" 
                  value={editedValue} 
                  onChange={(e) => setEditedValue(e.target.value)} 
                  className="text-3xl font-bold bg-transparent border-b-2 border-white/50 text-center focus:outline-none focus:border-white" 
                  autoFocus 
                />
                <button onClick={handleSave} className="text-green-400 hover:text-green-300"><FaCheck size={18}/></button>
                <button onClick={handleCancel} className="text-red-400 hover:text-red-300"><FaTimes size={18}/></button>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-white">{profileData.nombre}</h1>
            )}
            <button 
              onClick={() => handleEditClick('nombre', profileData.nombre)} 
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit size={18}/>
            </button>
          </div>

          {/* 2. Lema de la empresa */}
          <div className="relative group">
            {editingField === 'lema' ? ( 
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={editedValue} 
                  onChange={(e) => setEditedValue(e.target.value)} 
                  className="text-xl italic bg-transparent border-b-2 border-white/50 text-center text-white/90 focus:outline-none focus:border-white" 
                  autoFocus 
                />
                <button onClick={handleSave} className="text-green-400 hover:text-green-300"><FaCheck size={16}/></button>
                <button onClick={handleCancel} className="text-red-400 hover:text-red-300"><FaTimes size={16}/></button>
              </div>
            ) : (
              <p className="font-normal italic text-xl text-white/90">{profileData.lema}</p>
            )}
            <button 
              onClick={() => handleEditClick('lema', profileData.lema)} 
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit size={16}/>
            </button>
          </div>
          
          {/* 3. NIT de la empresa */}
          <div className="relative group">
            {editingField === 'nit' ? ( 
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={editedValue} 
                  onChange={(e) => setEditedValue(e.target.value)} 
                  className="text-base font-mono bg-transparent border-b-2 border-white/50 text-center text-white/80 focus:outline-none focus:border-white" 
                  autoFocus 
                />
                <button onClick={handleSave} className="text-green-400 hover:text-green-300"><FaCheck size={14}/></button>
                <button onClick={handleCancel} className="text-red-400 hover:text-red-300"><FaTimes size={14}/></button>
              </div>
            ) : (
              <p className="text-white/80 text-base tracking-wider font-mono">{profileData.nit}</p>
            )}
            <button 
              onClick={() => handleEditClick('nit', profileData.nit)} 
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit size={16}/>
            </button>
          </div>
        </div>

        {/* Especialidades */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
          {profileData.especialidades.map((spec, i) => (
            <div key={i} className="relative group bg-yellow-400 text-[#00324D] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-yellow-300 transition-colors">
              {editingField === `especialidad-${i}` ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={editedValue} 
                    onChange={(e) => setEditedValue(e.target.value)} 
                    className="bg-transparent border-b-2 border-[#00324D]/50 w-20 text-center outline-none text-sm focus:border-[#00324D]" 
                    autoFocus
                  />
                  <button onClick={handleSave} className="text-green-800"><FaCheck size={12}/></button>
                  <button onClick={handleCancel} className="text-red-800"><FaTimes size={12}/></button>
                </div>
              ) : (
                <>
                  <span>{spec}</span>
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(`especialidad-${i}`, spec)} 
                      className="bg-[#00324D] text-white w-6 h-6 text-xs rounded-full flex items-center justify-center shadow-lg hover:bg-[#004267]"
                    >
                      <FaEdit size={10} />
                    </button>
                    <button 
                      onClick={() => removeSpecialty(i)} 
                      className="bg-red-600 text-white w-6 h-6 text-xs rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
                    >
                      <FaMinus size={10} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="flex items-center gap-1 ml-3">
            <input 
              type="text" 
              value={newSpecialty} 
              onChange={(e) => setNewSpecialty(e.target.value)} 
              placeholder="Nueva especialidad" 
              className="bg-white/10 text-white placeholder-white/50 text-sm px-4 py-2 rounded-full w-40 outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white/20 transition-all"
            />
            <button 
              onClick={addSpecialty} 
              className="bg-yellow-400 text-[#00324D] w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-sm"
            >
              <FaPlus size={12}/>
            </button>
          </div>
        </div>
      </header>
      
      {/* --- CUERPO PRINCIPAL --- */}
      <main className="pt-6 px-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
          <div className="space-y-8">
            <InfoField icon={<FaBuilding/>} label="Razón Social:" fieldKey="razonSocial"/>
            <InfoField icon={<FaMapMarkedAlt/>} label="Dirección:" fieldKey="direccion"/>
            <InfoField icon={<FaLayerGroup/>} label="Departamento:" fieldKey="departamento"/>
            <InfoField icon={<FaPhone/>} label="Teléfono:" fieldKey="telefono"/>
          </div>
          <div className="space-y-8">
            <InfoField icon={<FaUsers/>} label="Número Empleados:" fieldKey="numEmpleados"/>
            <InfoField icon={<FaCity/>} label="Ciudad:" fieldKey="ciudad"/>
            <InfoField icon={<FaGlobe/>} label="Página Web:" fieldKey="paginaWeb"/>
            <InfoField icon={<FaLaptopCode/>} label="Sector Económico:" fieldKey="sector"/>
          </div>

          <div className="relative group md:col-span-3 lg:col-span-1">
            <div className="flex items-start gap-5">
              <div className="text-3xl text-[#00324D] w-10 text-center mt-1"><FaQuoteRight/></div>
              <div className="flex-grow">
                <span className="font-bold text-slate-600 block text-base">Descripción:</span>
                {editingField === 'descripcion' ? (
                  <div className="flex flex-col gap-3 mt-2">
                    <textarea 
                      value={editedValue} 
                      onChange={(e) => setEditedValue(e.target.value)} 
                      className="border-2 border-[#00324D] rounded-lg px-3 py-2 w-full h-40 text-base focus:ring-2 focus:ring-[#00324D] focus:outline-none" 
                      autoFocus 
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><FaCheck size={14}/> 
                      </button>
                      <button onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><FaTimes size={14}/> </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#00324D]/10 border-l-4 border-[#00324D] text-[#00324D] p-4 rounded-r-lg text-base mt-1 leading-relaxed">
                    {profileData.descripcion}
                  </div>
                )}
              </div>
            </div>
            {editingField !== 'descripcion' && (
              <button 
                onClick={() => handleEditClick('descripcion', profileData.descripcion)} 
                className="absolute right-0 top-1 text-slate-400 hover:text-[#00324D] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaEdit size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-6">
  {/* Botón Ver Requisitos */}
  <a 
    href="/requisitos" 
    className="inline-block bg-[#00324D] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#004267] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
  >
    Ver Requisitos
  </a>

  {/* Botón Cerrar Sesión */}
  <a 
    href="/logout" 
    className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
  >
    Cerrar Sesión
  </a>
</div>


      </main>
    </div>
  );
}