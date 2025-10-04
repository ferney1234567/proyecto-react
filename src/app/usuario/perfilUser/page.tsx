'use client';

import {
  FaBuilding, FaMapMarkedAlt, FaPhone, FaGlobe, FaUsers, FaCity, FaLayerGroup,
  FaLaptopCode, FaArrowLeft, FaEdit, FaCheck, FaTimes, FaPlus, FaMinus, FaQuoteRight
} from 'react-icons/fa';
import { Sun, Moon, RefreshCcw, ZoomOut, ZoomIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

// 👇 Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';

// TIPOS
interface ProfileData {
  nombre: string;
  email: string;
  nit: string;
  logo: string;
  intereses: any[];
  razonSocial: string;
  direccion: string;
  departamento: string;
  telefono: string;
  numEmpleados: string;
  ciudad: string;
  paginaWeb: string;
  sector: string;
  descripcion: string;
}


interface Departamento {
  id: number;
  name: string;
}

interface Ciudad {
  id: number;
  name: string;
  departmentId: number;
}

export default function PerfilEmpresa() {
  const router = useRouter();
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);


  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [filteredCities, setFilteredCities] = useState<Ciudad[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');

  // 👇 Add missing state variables here
  const [mostrarZoom, setMostrarZoom] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Zoom functions
  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);
  const aumentarTexto = () => setFontSize((prev) => prev + 2);
  const disminuirTexto = () => setFontSize((prev) => Math.max(10, prev - 2));
  const resetTexto = () => setFontSize(16);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState('');

  // --- Usuario logueado ---
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const getUserId = (u: any) => {
    if (!u) return null;
    return u.id ?? u.userId ?? u.uid ?? u.uId ?? null;
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const userParsed = JSON.parse(usuarioGuardado);
      setUser(userParsed);
      setUserId(getUserId(userParsed));
    }

    const fetchAuthUser = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/auths/authenticated", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("No autenticado");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setUserId(getUserId(data.user));
          localStorage.setItem("usuario", JSON.stringify(data.user));
        }
      } catch {
        router.push("/");
      }
    };
    fetchAuthUser();
  }, [router]);



  // 🔹 Cargar departamentos y ciudades desde las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await fetch('http://localhost:4000/api/v1/departments');
        const cityRes = await fetch('http://localhost:4000/api/v1/cities');
        const depData = await depRes.json();
        const cityData = await cityRes.json();
        setDepartamentos(depData.data || []);
        setCiudades(cityData.data || []);
      } catch (err) {
        console.error('Error cargando departamentos o ciudades', err);
      }
    };
    fetchData();
  }, []);


  // 🔹 Filtrar ciudades según el departamento seleccionado
  useEffect(() => {
    if (selectedDept) {
      const dept = departamentos.find(d => d.name === selectedDept);
      if (dept) {
        const filtered = ciudades.filter(c => c.departmentId === dept.id);
        setFilteredCities(filtered);
      }
    }
  }, [selectedDept, ciudades, departamentos]);








  // --- Estados ---
  const [newInterest, setNewInterest] = useState('');

  // Estado inicial vacío, sin datos quemados
  const [profileData, setProfileData] = useState<ProfileData>({
    nombre: '',
    email: '',
    nit: '',
    logo: '',
    intereses: [],
    razonSocial: '',
    direccion: '',
    departamento: '',
    telefono: '',
    numEmpleados: '',
    ciudad: '',
    paginaWeb: '',
    sector: '',
    descripcion: ''
  });

  // Placeholders de ejemplo para mostrar si el campo está vacío
  const empresaPlaceholders: Record<keyof ProfileData, string> = {
    nombre: "Ejemplo: Empresa de Software",
    email: "Ejemplo: Eje@gmail.com",
    nit: "Ejemplo: 123456789-0",
    logo: "",
    intereses: "",
    razonSocial: "Ejemplo: Industrias Andinas S.A.",
    direccion: "Ejemplo: Carrera 45 #78-123, Zona Industrial",
    departamento: "Ejemplo: Antioquia",
    telefono: "Ejemplo: 6043456789",
    numEmpleados: "Ejemplo: 50",
    ciudad: "Ejemplo: Medellín",
    paginaWeb: "Ejemplo: https://miempresa.com",
    sector: "Ejemplo: Tecnología",
    descripcion: "Ejemplo: Somos una empresa dedicada a..."
  };

  // --- Cargar intereses (NO TOCAR) ---
  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        if (!userId) return;
        const res = await fetch("http://localhost:4000/api/v1/userInterests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Error al cargar intereses");

        const data = await res.json();
        const interesesUsuario = data.data
          .filter((i: any) => i.userId === Number(userId))
          .map((i: any) => ({
            userInterestId: i.id,
            id: i.interest?.id,
            name: i.interest?.name,
            description: i.interest?.description,
          }));
        setProfileData(prev => ({ ...prev, intereses: interesesUsuario }));
      } catch (err: any) {
        console.error("⚠️ Error al cargar intereses:", err.message);
        setProfileData(prev => ({ ...prev, intereses: [] }));
      }
    };
    fetchUserInterests();
  }, [userId]);

  // --- Agregar interés (NO TOCAR) ---
  const addInterest = async () => {
    if (!newInterest.trim()) return Swal.fire("Atención", "Debes escribir un interés válido", "warning");
    if (!userId) return Swal.fire("Error", "Usuario no identificado", "error");

    try {
      const resInterest = await fetch("http://localhost:4000/api/v1/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: newInterest.trim(), description: "Interés agregado por el usuario" })
      });
      const interestData = await resInterest.json();
      if (!resInterest.ok) throw new Error(interestData.message);
      const interestId = interestData.data?.id;

      const resUserInterest = await fetch("http://localhost:4000/api/v1/userInterests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId, interestId })
      });
      const userInterestResp = await resUserInterest.json();
      if (!resUserInterest.ok) throw new Error(userInterestResp.message);

      const nuevo = {
        userInterestId: userInterestResp.data?.id,
        id: interestId,
        name: newInterest.trim(),
        description: "Interés agregado por el usuario",
      };
      setProfileData(prev => ({ ...prev, intereses: [...prev.intereses, nuevo] }));
      setNewInterest("");
      Swal.fire("Éxito", "Interés agregado correctamente", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // --- Editar interés (NO TOCAR) ---
  const updateInterest = async (interest: any, newName: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/interests/${interest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: newName })
      });

      if (!res.ok) throw new Error("Error al actualizar interés");

      const data = await res.json();

      const actualizados = profileData.intereses.map(i =>
        i.id === interest.id ? { ...i, name: data.data.name } : i
      );

      setProfileData(prev => ({ ...prev, intereses: actualizados }));
      Swal.fire("Éxito", "Interés actualizado en la base de datos", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // --- Eliminar interés (NO TOCAR) ---
  const removeInterest = async (interest: any) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/userInterests/${userId}/${interest.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Error al eliminar interés");

      const restantes = profileData.intereses.filter(i => i.id !== interest.id);
      setProfileData(prev => ({ ...prev, intereses: restantes }));
      Swal.fire("Eliminado", `"${interest.name}" fue eliminado`, "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // --- Empresa logueada ---
  const [empresa, setEmpresa] = useState<any>(null);
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  const toCompanyPayload = (p: ProfileData) => {
    // 🔹 Buscar ciudad seleccionada
    const ciudadSeleccionada = ciudades.find(c => c.name === p.ciudad);

    return {
      name: p.nombre || undefined,
      taxId: p.nit || undefined,
      legalName: p.razonSocial || undefined,
      address: p.direccion || undefined,
      phone: p.telefono || undefined,
      website: p.paginaWeb || undefined,
      employeeCount: p.numEmpleados
        ? Number(String(p.numEmpleados).replace(/\D/g, ''))
        : undefined,
      economicSector: p.sector || undefined,
      description: p.descripcion || undefined,
      email: p.email || undefined,              // ✅ Guarda email
      cityId: ciudadSeleccionada?.id || null,   // ✅ Envía id correcto
    };
  };


  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/companies", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Error al cargar empresas");
        const data = await res.json();
        const list: any[] = data?.data ?? [];

        const mine = user?.email
          ? list.find((c: any) => c.email === user.email)
          : null;

        if (mine) {
          setEmpresa(mine);
          setEmpresaId(mine.id);
          localStorage.setItem("empresa", JSON.stringify(mine));

          // ✅ Bloque corregido
          setProfileData(prev => {
            const ciudadNombre = mine.city?.name ?? '';
            const departamentoNombre =
              departamentos.find(d => d.id === mine.city?.departmentId)?.name ?? '';

            return {
              ...prev,
              nombre: mine.name ?? prev.nombre,
              email: mine.email ?? prev.email,
              nit: mine.taxId ?? prev.nit,
              razonSocial: mine.legalName ?? prev.razonSocial,
              direccion: mine.address ?? prev.direccion,
              telefono: mine.phone ?? prev.telefono,
              paginaWeb: mine.website ?? prev.paginaWeb,
              numEmpleados:
                mine.employeeCount != null ? String(mine.employeeCount) : prev.numEmpleados,
              sector: mine.economicSector ?? prev.sector,
              descripcion: mine.description ?? prev.descripcion,
              ciudad: ciudadNombre || prev.ciudad,
              departamento: departamentoNombre || prev.departamento,
            };
          });

        } else {
          setEmpresa(null);
          setEmpresaId(null);
          setProfileData(prev => ({ ...prev }));
        }
      } catch (err: any) {
        console.error("⚠️ Error al cargar empresa:", err.message);
      }
    };
    fetchEmpresa();
  }, [user]);

  const handleEditClick = (fieldKey: string, currentValue: string) => {
    setEditingField(fieldKey);
    setEditedValue(currentValue || "");
  };

  const handleCancel = () => setEditingField(null);

  const handleSave = async () => {
    if (!editingField) return;

    const newData: ProfileData = { ...profileData, [editingField]: editedValue } as ProfileData;
    setProfileData(newData);
    setEditingField(null);

    const payload = toCompanyPayload(newData);

    if (editingField === "departamento") {
      setSelectedDept(editedValue);
    }
    if (editingField === "ciudad") {
      const ciudadSeleccionada = ciudades.find(c => c.name === editedValue);
      if (ciudadSeleccionada) {
        newData.ciudad = ciudadSeleccionada.name;
      }
    }

    try {
      let res: Response;
      if (empresaId) {
        res = await fetch(`http://localhost:4000/api/v1/companies/${empresaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("http://localhost:4000/api/v1/companies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al guardar empresa");

      if (!empresaId && data?.data?.id) setEmpresaId(data.data.id);
      if (data?.data) setEmpresa(data.data);

      Swal.fire("Éxito", "Datos de la empresa guardados correctamente", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // --- Cerrar sesión ---
  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar"
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/");
      }
    });
  };

  // 🔹 Filtrar ciudades según el departamento seleccionado
 useEffect(() => {
  if (selectedDept) {
    const dept = departamentos.find(d => d.name === selectedDept);
    if (dept) {
      const filtered = ciudades.filter(
        (c) => c.departmentId === dept.id
      );
      setFilteredCities(filtered);
    } else {
      // Si no hay departamento, mostrar todas las ciudades sin departmentId
      setFilteredCities(ciudades.filter(c => !c.departmentId));
    }
  } else {
    // Si no se selecciona ningún depto, mostrar todas
    setFilteredCities(ciudades);
  }
}, [selectedDept, ciudades, departamentos]);


  // 👇 InfoField con soporte para selects dinámicos (departamento y ciudad)
  const InfoField = ({
    icon,
    label,
    fieldKey
  }: {
    icon: React.ReactNode;
    label: string;
    fieldKey: keyof ProfileData;
  }) => {
    const displayValue = profileData[fieldKey] || empresaPlaceholders[fieldKey];
    const isPlaceholder = !profileData[fieldKey];
    const isDept = fieldKey === "departamento";
    const isCity = fieldKey === "ciudad";

    return (
      <div className="relative group flex items-start gap-5">
        <div
          className={`w-10 text-center mt-1 ${styles.text}`}
          style={{ fontSize: `${fontSize * 1.25}px` }}
        >
          {icon}
        </div>
        <div className="flex-grow">
          <span
            className={`font-bold block ${styles.textMuted}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {label}
          </span>

          {editingField === fieldKey ? (
            <div className="flex gap-2 mt-1">
              {/* 🔽 SELECT DE DEPARTAMENTO */}
              {isDept ? (
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDept(value);
                    setEditedValue(value);

                    // Filtrar las ciudades que pertenecen a ese departamento
                    const dept = departamentos.find((d) => d.name === value);
                    if (dept) {
                      const filtered = ciudades.filter(
                        (c) => c.departmentId === dept.id
                      );
                      setFilteredCities(filtered);
                    }

                    // Si el usuario cambia de departamento, limpiamos la ciudad
                    setProfileData((prev) => ({ ...prev, ciudad: "" }));
                  }}
                  className="border rounded-lg p-2 w-full bg-white text-black"
                  disabled={profileData.ciudad !== ""} // 🧾 Desactiva si ya hay una ciudad seleccionada
                >
                  <option value="">Seleccione un departamento</option>
                  {departamentos.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : isCity ? (
                /* 🔽 SELECT DE CIUDAD FILTRADA */
                <select
                  value={editedValue}
                  onChange={(e) => {
                    const ciudadSeleccionada = e.target.value;
                    setEditedValue(ciudadSeleccionada);

                    // Buscar la ciudad y su departamento
                    const ciudadObj = ciudades.find(
                      (c) => c.name === ciudadSeleccionada
                    );
                    if (ciudadObj) {
                      const departamentoObj = departamentos.find(
                        (d) => d.id === ciudadObj.departmentId
                      );

                      if (departamentoObj) {
                        // ✅ Actualizar automáticamente el campo departamento
                        setSelectedDept(departamentoObj.name);
                        setProfileData((prev) => ({
                          ...prev,
                          departamento: departamentoObj.name,
                        }));
                      }
                    }
                  }}
                  className="border rounded-lg p-2 w-full bg-white text-black"
                >
                  <option value="">Seleccione una ciudad</option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                /* 🔤 CAMPOS NORMALES */
                <input
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  className={`rounded-lg px-3 py-1 w-full focus:ring-2 ${styles.input}`}
                  style={{ fontSize: `${fontSize}px` }}
                  autoFocus
                  placeholder={empresaPlaceholders[fieldKey]}
                />
              )}

              {/* ✅ Botones de guardar y cancelar */}
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-2 rounded"
              >
                <FaCheck />
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-2 rounded"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            /* 👇 Valor mostrado normalmente */
            <span
              className={`inline-block px-4 py-2 rounded-lg font-medium mt-1 ${modoOscuro
                  ? isPlaceholder
                    ? "bg-white/10 text-white/60 italic"
                    : "bg-white/5 text-white"
                  : isPlaceholder
                    ? "bg-[#00324D]/5 text-[#00324D]/60 italic"
                    : "bg-[#00324D]/10 text-[#00324D]"
                }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {String(displayValue)}
            </span>
          )}
        </div>

        {/* ✏️ Botón de edición */}
        {editingField !== fieldKey && (
          <button
            onClick={() =>
              handleEditClick(fieldKey, String(profileData[fieldKey] || ""))
            }
            className={`absolute right-0 top-1 opacity-0 group-hover:opacity-100 ${styles.textMuted}`}
          >
            <FaEdit size={fontSize + 2} />
          </button>
        )}
      </div>
    );
  };



  return (
    <div className={`min-h-screen ${styles.fondo}`}>
      <div className={`max-w-7xl mx-auto my-6 rounded-3xl shadow-xl ${styles.divider} ${styles.card}`}>
        {/* HEADER */}
        <header className={`${modoOscuro ? 'bg-gradient-to-b from-[#0b1220] to-[#0a0f1a]' : 'bg-gradient-to-b from-[#00324D] to-[#001a27]'} text-white p-6 text-center pb-12 rounded-t-3xl`}>
          <div className="flex justify-start mb-4">
            <button onClick={() => router.push('/menu')} className="bg-white/10 rounded-full hover:bg-white/20 p-3">
              <FaArrowLeft size={18} />
            </button>
          </div>

          {/* Botones flotantes (modo oscuro + zoom) */}
          <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
            {/* Botón modo oscuro */}
            <button
              onClick={toggleModoOscuro}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Cambiar modo"
            >
              {modoOscuro ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* Botón principal menú de zoom */}
            <button
              onClick={toggleZoomMenu}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Opciones de texto"
            >
              <ZoomIn className="h-6 w-6" />
            </button>

            {/* Botones secundarios (se muestran solo si mostrarZoom = true) */}
            {mostrarZoom && (
              <div className="flex flex-col space-y-3 mt-2 animate-fade-in">
                <button
                  onClick={aumentarTexto}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  title="Aumentar texto"
                >
                  <ZoomIn className="h-6 w-6" />
                </button>

                <button
                  onClick={resetTexto}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  title="Restablecer tamaño"
                >
                  <RefreshCcw className="h-6 w-6" />
                </button>

                <button
                  onClick={disminuirTexto}
                  className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                    ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  title="Disminuir texto"
                >
                  <ZoomOut className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>

          <div className="w-36 h-36 mt-4 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto">
            {profileData.logo ? (
              <img
                src={profileData.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="../../../../public/img/eco.jpeg"
                alt="Sin logo"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Nombre, email y nit editables con tamaño dinámico */}
          <div className="relative group max-w-2xl mx-auto">
            <h1 className="font-bold mt-4" style={{ fontSize: `${fontSize * 2}px` }}>
              {editingField === 'nombre' ? (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="rounded px-3 py-2 text-black w-full max-w-md"
                    style={{ fontSize: `${fontSize}px` }}
                    autoFocus
                    placeholder={empresaPlaceholders.nombre}
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-3 py-2 rounded"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <span className={!profileData.nombre ? 'italic opacity-80' : ''}>
                  {user?.fullName || user?.username || user?.name || profileData.nombre || empresaPlaceholders.nombre}
                </span>
              )}
            </h1>

            {editingField !== 'nombre' && (
              <button
                onClick={() => handleEditClick('nombre', profileData.nombre)}
                className="absolute -right-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/80 hover:text-white"
              >
                <FaEdit size={18} />
              </button>
            )}
          </div>

          <div className="relative group max-w-2xl mx-auto mt-2">
            <div className="italic text-white/80" style={{ fontSize: `${fontSize * 1.1}px` }}>
              {editingField === 'email' ? (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="rounded px-3 py-1 text-black w-full max-w-md"
                    style={{ fontSize: `${fontSize}px` }}
                    autoFocus
                    placeholder={empresaPlaceholders.email}
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-2 rounded hover:bg-green-700 transition"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-2 rounded hover:bg-red-700 transition"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <span
                  className={`${!profileData.email ? 'italic opacity-70' : ''
                    }`}
                >
                  {profileData.email || empresaPlaceholders.email}
                </span>
              )}
            </div>

            {editingField !== 'email' && (
              <button
                onClick={() => handleEditClick('email', profileData.email)}
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/60 hover:text-white transition"
              >
                <FaEdit size={14} />
              </button>
            )}
          </div>


          <div className="relative group max-w-2xl mx-auto mt-1">
            <div className="text-white/60" style={{ fontSize: `${fontSize * 0.9}px` }}>
              {editingField === 'nit' ? (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="rounded px-2 py-1 text-black w-full max-w-xs"
                    style={{ fontSize: `${fontSize}px` }}
                    autoFocus
                    placeholder={empresaPlaceholders.nit}
                  />
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-2 rounded"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-2 rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <span
                  className={!profileData.nit ? 'italic opacity-70' : ''}
                >
                  {profileData.nit || empresaPlaceholders.nit}
                </span>
              )}
            </div>

            {editingField !== 'nit' && (
              <button
                onClick={() => handleEditClick('nit', profileData.nit)}
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"
              >
                <FaEdit size={12} />
              </button>
            )}
          </div>


          {/* Intereses con tamaño dinámico */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {profileData.intereses.map((interest, i) => (
              <span
                key={i}
                className={`px-4 py-2 rounded-full font-semibold shadow-sm flex items-center gap-2 ${modoOscuro
                  ? 'bg-yellow-400 text-[#00324D]'
                  : 'bg-white text-[#00324D] border border-[#00324D]/20'
                  }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {editingField === `interest-${i}` ? (
                  <>
                    <input
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="rounded px-2 py-1 text-black border border-gray-300"
                      style={{ fontSize: `${fontSize}px` }}
                      autoFocus
                    />
                    <button
                      onClick={() => { updateInterest(interest, editedValue); setEditingField(null); }}
                      className="bg-green-600 text-white w-5 h-5 rounded-full flex justify-center items-center hover:bg-green-700"
                    >
                      <FaCheck size={10} />
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="bg-red-600 text-white w-5 h-5 rounded-full flex justify-center items-center hover:bg-red-700"
                    >
                      <FaTimes size={10} />
                    </button>
                  </>
                ) : (
                  <>
                    {interest.name}
                    <button
                      onClick={() => handleEditClick(`interest-${i}`, interest.name)}
                      className={`ml-1 ${modoOscuro ? 'text-blue-900 hover:text-blue-700' : 'text-[#00324D] hover:text-[#001a27]'
                        }`}
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 bg-red-600 text-white w-5 h-5 rounded-full flex justify-center items-center hover:bg-red-700"
                    >
                      <FaMinus size={10} />
                    </button>
                  </>
                )}
              </span>
            ))}
          </div>

          {profileData.intereses.length < 5 && (
            <div className="mt-4 flex justify-center gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Nuevo interés"
                className={`px-4 py-2 rounded-full w-44 outline-none transition-all ${modoOscuro
                  ? 'bg-white/10 text-white placeholder-white/60 focus:bg-white/20'
                  : 'bg-white text-[#00324D] placeholder-gray-500 border border-[#00324D]/30 focus:border-[#00324D] focus:ring-2 focus:ring-[#00324D]/20'
                  }`}
                style={{ fontSize: `${fontSize}px` }}
              />
              <button
                onClick={addInterest}
                disabled={!userId}
                className={`${modoOscuro
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-[#00324D] text-white hover:bg-[#002337]'
                  } w-8 h-8 rounded-full flex items-center justify-center transition-all ${!userId && 'opacity-50 cursor-not-allowed'
                  }`}
              >
                <FaPlus size={14} />
              </button>
            </div>
          )}
        </header>

        {/* MAIN */}
        <main className="pt-6 px-6 md:px-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
            {/* Columna 1 */}
            <div className="space-y-8">
              <InfoField icon={<FaBuilding />} label="Razón Social:" fieldKey="razonSocial" />
              <InfoField icon={<FaMapMarkedAlt />} label="Dirección:" fieldKey="direccion" />
              <InfoField icon={<FaLayerGroup />} label="Departamento:" fieldKey="departamento" />
              <InfoField icon={<FaPhone />} label="Teléfono:" fieldKey="telefono" />
            </div>

            {/* Columna 2 */}
            <div className="space-y-8">
              <InfoField icon={<FaUsers />} label="Número Empleados:" fieldKey="numEmpleados" />
              <InfoField icon={<FaCity />} label="Ciudad:" fieldKey="ciudad" />
              <InfoField icon={<FaGlobe />} label="Página Web:" fieldKey="paginaWeb" />
              <InfoField icon={<FaLaptopCode />} label="Sector Económico:" fieldKey="sector" />
            </div>

            {/* Descripción con tamaño dinámico */}
            <div className="relative group md:col-span-3 lg:col-span-1">
              <div className="flex items-start gap-5">
                <div className={`w-10 text-center mt-1 ${styles.text}`} style={{ fontSize: `${fontSize * 1.5}px` }}>
                  <FaQuoteRight />
                </div>
                <div className="flex-grow">
                  <span
                    className={`font-bold block ${styles.textMuted}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    Descripción:
                  </span>
                  {editingField === 'descripcion' ? (
                    <div className="flex flex-col gap-3 mt-2">
                      <textarea
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className={`rounded-lg px-3 py-2 w-full h-40 focus:ring-2 ${styles.input}`}
                        style={{ fontSize: `${fontSize}px` }}
                        autoFocus
                        placeholder={empresaPlaceholders.descripcion}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                          <FaCheck size={14} /> Guardar
                        </button>
                        <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                          <FaTimes size={14} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${modoOscuro ? 'bg-white/5 border-l-4 border-white/20' : 'bg-[#00324D]/10 border-l-4 border-[#00324D]'} p-4 rounded-r-lg mt-1 leading-relaxed ${!profileData.descripcion ? 'italic text-opacity-60' : modoOscuro ? 'text-white' : 'text-[#00324D]'
                        }`}
                      style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.5}px` }}
                    >
                      {profileData.descripcion || empresaPlaceholders.descripcion}
                    </div>
                  )}
                </div>
              </div>
              {editingField !== 'descripcion' && (
                <button
                  onClick={() => handleEditClick('descripcion', profileData.descripcion)}
                  className={`absolute right-0 top-1 opacity-0 group-hover:opacity-100 ${styles.textMuted} hover:${modoOscuro ? 'text-white' : 'text-[#00324D]'}`}
                >
                  <FaEdit size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Botones de acción con tamaño dinámico */}
          <div className="mt-12 flex justify-center gap-6">
            <a
              href="/requisitos"
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${styles.primaryButton} hover:scale-105 transform`}
              style={{ fontSize: `${fontSize}px` }}
            >
              Ver Requisitos
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 transform"
              style={{ fontSize: `${fontSize}px` }}
            >
              Cerrar Sesión
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}