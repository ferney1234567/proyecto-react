'use client';

import {
  FaBuilding, FaMapMarkedAlt, FaPhone, FaGlobe, FaUsers, FaCity, FaLayerGroup,
  FaLaptopCode, FaArrowLeft, FaEdit, FaCheck, FaTimes, FaPlus, FaMinus, FaQuoteRight
} from 'react-icons/fa';
import { Sun, Moon, RefreshCcw, ZoomOut, ZoomIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";

import DatosEmpresaModal from "./DatosEmpresaModal";
// ðŸ‘‡ Tema
import { useTheme } from '../../ThemeContext';
import { getThemeStyles } from '../../themeStyles';
import { useFontSize } from '../../../../FontSizeContext';
import { MdAccessibility } from 'react-icons/md';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export default function PerfilEmpresa() {
  const router = useRouter();
  const { modoOscuro, toggleModoOscuro } = useTheme();
  const styles = getThemeStyles(modoOscuro);

  const [mostrarModal, setMostrarModal] = useState(false);


  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [filteredCities, setFilteredCities] = useState<Ciudad[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('');

  // ðŸ‘‡ Add missing state variables here
  const [mostrarZoom, setMostrarZoom] = useState(false);

  const [interestsList, setInterestsList] = useState<any[]>([]);

  const { fontSize, aumentarTexto, disminuirTexto, resetTexto } = useFontSize();
  // Zoom functions
  const toggleZoomMenu = () => setMostrarZoom(!mostrarZoom);

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
        const res = await fetch(`${API_URL}/auths/authenticated`, {
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


  const [mostrarSelector, setMostrarSelector] = useState(false);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  // ðŸ”¹ Cuando el selector se muestra, hacer focus automÃ¡tico
  useEffect(() => {
    if (mostrarSelector && selectRef.current) {
      selectRef.current.focus();
    }
  }, [mostrarSelector]);
  // ðŸ”¹ Cargar departamentos y ciudades desde las APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await fetch(`${API_URL}/departments`);
        const cityRes = await fetch(`${API_URL}/cities`);
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


  // ðŸ”¹ Filtrar ciudades segÃºn el departamento seleccionado
  useEffect(() => {
    if (selectedDept) {
      const dept = departamentos.find(d => d.name === selectedDept);
      if (dept) {
        const filtered = ciudades.filter(c => c.departmentId === dept.id);
        setFilteredCities(filtered);
      }
    }
  }, [selectedDept, ciudades, departamentos]);


  // ðŸ”¹ Cargar todos los intereses disponibles
  useEffect(() => {
    const fetchAllInterests = async () => {
      try {
        const res = await fetch(`${API_URL}/interests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Error al cargar lista de intereses");
        const data = await res.json();
        setInterestsList(data.data || []);
      } catch (err: any) {
        console.error("Error al cargar lista de intereses:", err.message);
      }
    };
    fetchAllInterests();
  }, []);

  // --- Estados ---
  const [newInterest, setNewInterest] = useState('');

  // Estado inicial vacÃ­o, sin datos quemados
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

  // Placeholders de ejemplo para mostrar si el campo estÃ¡ vacÃ­o
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
    ciudad: "Ejemplo: Medelli­n",
    paginaWeb: "Ejemplo: https://miempresa.com",
    sector: "Ejemplo: Tecnolog­0",
    descripcion: "Ejemplo: Somos una empresa dedicada a..."
  };

  // --- Cargar intereses (NO TOCAR) ---
  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        if (!userId) return console.log("⚠️ userId no disponible");
        console.log("🔐 Token:", localStorage.getItem("token"));
        console.log("👤 userId:", userId);

        const res = await fetch(`${API_URL}/userInterests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("📡 Estado:", res.status);
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);

        if (!res.ok) throw new Error("Error al cargar los intereses del usuario");

        const interesesUsuario =
          data.data
            ?.filter((i: any) => i.userId === Number(userId))
            ?.map((i: any) => ({
              userInterestId: i.id,
              id: i.interest?.id,
              name: i.interest?.name,
              description: i.interest?.description,
            })) ?? [];

        setProfileData((prev) => ({ ...prev, intereses: interesesUsuario }));
      } catch (err: any) {
        console.error("❌ Error al cargar los intereses:", err.message);
        setProfileData((prev) => ({ ...prev, intereses: [] }));
      }
    };

    fetchUserInterests();
  }, [userId]);



  // --- Agregar interés (NO TOCAR) ---
  const addInterest = async () => {
    if (!newInterest.trim())
      return Swal.fire("Atención", "Debes escribir un interés válido.", "warning");

    if (!userId)
      return Swal.fire("Error", "Usuario no identificado.", "error");

    try {
      const resInterest = await fetch(`${API_URL}/interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newInterest.trim(),
          description: "Interés agregado por el usuario.",
        }),
      });

      const interestData = await resInterest.json();
      if (!resInterest.ok) throw new Error(interestData.message);
      const interestId = interestData.data?.id;

      const resUserInterest = await fetch(`${API_URL}/userInterests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId, interestId }),
      });

      const userInterestResp = await resUserInterest.json();
      if (!resUserInterest.ok) throw new Error(userInterestResp.message);

      const nuevo = {
        userInterestId: userInterestResp.data?.id,
        id: interestId,
        name: newInterest.trim(),
        description: "Interés agregado por el usuario.",
      };

      setProfileData((prev) => ({
        ...prev,
        intereses: [...prev.intereses, nuevo],
      }));

      setNewInterest("");
      Swal.fire("Éxito", "Interés agregado correctamente.", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };


  // --- Editar interés (NO TOCAR) ---
  const updateInterest = async (interest: any, newName: string) => {
    try {
      const res = await fetch(`${API_URL}/userInterests/${interest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("Error al actualizar el interés.");

      const data = await res.json();

      const actualizados = profileData.intereses.map((i) =>
        i.id === interest.id ? { ...i, name: data.data.name } : i
      );

      setProfileData((prev) => ({ ...prev, intereses: actualizados }));
      Swal.fire("Éxito", "Interés actualizado en la base de datos.", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };


  // --- Eliminar interÃ©s (NO TOCAR) ---
  const removeInterest = async (interest: any) => {
    try {
      const res = await fetch(`${API_URL}/userInterests/${userId}/${interest.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (!res.ok) throw new Error("Error al eliminar interÃ©s");

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

      // ✅ Fijar siempre el email del usuario logueado
      email: user?.email || "",

      cityId: ciudadSeleccionada?.id || null,
    };
  };



  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch(`${API_URL}/companies`, {
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

          // âœ… Bloque corregido
          setProfileData(prev => {
            const ciudadNombre = mine.city?.name ?? '';
            const departamentoNombre =
              departamentos.find(d => d.id === mine.city?.departmentId)?.name ?? '';

            return {
              ...prev,
              nombre: mine.name ?? prev.nombre,
              email: mine.email || user?.email || prev.email || "", // ✅ fuerza a tener algún correo
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
        console.error("⚠️ Error al cargar la empresa:", err.message);

      }
    };
    fetchEmpresa();
  }, [user]);

  // ðŸ” Cuando los departamentos estÃ©n cargados, actualiza el departamento si la empresa ya existe
  useEffect(() => {
    if (!empresa || !empresa.city || !departamentos.length) return;

    const departamentoObj = departamentos.find(
      (d) => d.id === empresa.city.departmentId
    );

    if (departamentoObj) {
      setProfileData((prev) => ({
        ...prev,
        departamento: departamentoObj.name,
      }));
    }
  }, [departamentos, empresa]);


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
        res = await fetch(`${API_URL}/companies/${empresaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/companies`, {
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
      if (data?.data) {
        setEmpresa(data.data);
        setProfileData(prev => ({
          ...prev,
          email: data.data.email || user?.email || prev.email || "",
        }));
      }


      Swal.fire("Exito", "Datos de la empresa guardados correctamente", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // âœ… Nombre del usuario y empresa (mostrar ambos si existen)
  const userName =
    user?.fullName || user?.username || user?.name || profileData.nombre || "Usuario";

  const empresaName = empresa?.name || profileData.razonSocial || "";

  const displayName = empresaName
    ? `${userName} - ${empresaName}`
    : userName;

  // --- Cerrar sesión ---
  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/");
      }
    });
  };


  // ðŸ”¹ Filtrar ciudades segÃºn el departamento seleccionado
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
      // Si no se selecciona ningÃºn depto, mostrar todas
      setFilteredCities(ciudades);
    }
  }, [selectedDept, ciudades, departamentos]);


  // ðŸ‘‡ InfoField con soporte para selects dinÃ¡micos (departamento y ciudad)
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
              {/* ðŸ”½ SELECT DE DEPARTAMENTO */}
              {isDept ? (
                /* ðŸ”¹ Departamento solo mostrado, dependiente de la ciudad */
                <input
                  type="text"
                  value={profileData.departamento || ""}
                  readOnly
                  className="border rounded-lg p-2 w-full bg-gray-100 text-gray-700 cursor-not-allowed"
                  placeholder="Elige primero una ciudad"
                />
              ) : isCity ? (
                /* ðŸ”¹ Selector de ciudad: al elegir una ciudad, se completa el departamento */
                <select
                  value={editedValue}
                  onChange={async (e) => {
                    const ciudadSeleccionada = e.target.value;
                    setEditedValue(ciudadSeleccionada);

                    // Buscar la ciudad y su departamento
                    const ciudadObj = ciudades.find((c) => c.name === ciudadSeleccionada);
                    if (!ciudadObj) return;

                    const departamentoObj = departamentos.find(
                      (d) => d.id === ciudadObj.departmentId
                    );

                    const departamentoName = departamentoObj?.name || "";

                    // Actualizar estados locales
                    setProfileData((prev) => ({
                      ...prev,
                      ciudad: ciudadSeleccionada,
                      departamento: departamentoName,
                    }));

                    // ðŸ”¹ Guardar automÃ¡ticamente en el backend
                    try {
                      const payload = toCompanyPayload({
                        ...profileData,
                        ciudad: ciudadSeleccionada,
                        departamento: departamentoName,
                      });

                      const res = empresaId
                        ? await fetch(`${API_URL}/companies/${empresaId}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify(payload),
                        })
                        : await fetch(`${API_URL}/companies`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify(payload),
                        });

                      const data = await res.json();
                      if (!res.ok)
                        throw new Error(data?.message || "Error al guardar empresa");

                      Swal.fire(
                        "exito",
                        `Ciudad (${ciudadSeleccionada}) y departamento (${departamentoName}) actualizados correctamente.`,
                        "success"
                      );
                    } catch (err: any) {
                      Swal.fire("Error", err.message, "error");
                    }
                  }}
                  className="border rounded-lg p-2 w-full bg-white text-black"
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                /* ðŸ”¤ Campos normales */
                <input
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  className={`rounded-lg px-3 py-1 w-full focus:ring-2 ${styles.input}`}
                  style={{ fontSize: `${fontSize}px` }}
                  autoFocus
                  placeholder={empresaPlaceholders[fieldKey]}
                />
              )}


              {/* âœ… Botones de guardar y cancelar */}
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
            /* ðŸ‘‡ Valor mostrado normalmente */
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

        {/* âœï¸ BotÃ³n de ediciÃ³n */}
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


  // ðŸ”¹ Agregar interÃ©s desde lista (sin escribir)
  const addInterestFromSelect = async (interestObj: any) => {
    if (!userId) return Swal.fire("Error", "Usuario no identificado", "error");

    try {
      const resUserInterest = await fetch(`${API_URL}/userInterests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId, interestId: interestObj.id })
      });

      const userInterestResp = await resUserInterest.json();
      if (!resUserInterest.ok) throw new Error(userInterestResp.message);

      const nuevo = {
        userInterestId: userInterestResp.data?.id,
        id: interestObj.id,
        name: interestObj.name,
        description: interestObj.description || "",
      };

      setProfileData(prev => ({ ...prev, intereses: [...prev.intereses, nuevo] }));
      setNewInterest("");
      Swal.fire("Exito", "Interes agregado correctamente", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };



  return (
   <div
  className={`min-h-screen w-full transition-colors duration-500 ${
    modoOscuro
      ? "bg-[#0b1220] text-gray-200"
      : "bg-white text-gray-800"
  }`}
  style={{ backgroundColor: modoOscuro ? "#0b1220" : "#ffffff" }}
>

  <div className={`max-w-7xl mx-auto mb-0 rounded-t-3xl shadow-none overflow-hidden ${styles.divider} ${styles.card}`}>

        {/* HEADER */}
        <header
      className={`${
        modoOscuro
          ? "bg-gradient-to-b from-[#0b1220] to-[#080d18]"
          : "bg-gradient-to-b from-[#00324D] to-[#001a27]"
      } text-white p-6 text-center pb-12 rounded-t-3xl`}
    >
          <div className="flex justify-start mb-4">
            <button onClick={() => router.push('/menu')} className="bg-white/10 rounded-full hover:bg-white/20 p-3">
              <FaArrowLeft size={18} />
            </button>
          </div>

          {/* Botones flotantes (modo oscuro + zoom) */}
          <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 items-end">
            {/* BotÃ³n modo oscuro */}
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

            {/* BotÃ³n principal menÃº de zoom */}
            <button
              onClick={toggleZoomMenu}
              className={`p-4 rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${modoOscuro
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              title="Opciones de texto"
            >
              <MdAccessibility className="h-6 w-6" />
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

          {/* Ã°Å¸â€Â¹ Imagen de perfil con URL editable */}
          <div className="relative w-36 h-36 mt-4 mx-auto">
            {/* CÃƒÂ­rculo con imagen */}
            <div
              className="cursor-pointer w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden hover:opacity-80 transition-all"
              title="Editar URL de imagen"
              onClick={() => setEditingField("logo")}
            >
              <img src={user?.imgUser || profileData.logo || "/img/eco.jpeg"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ã¢Å“ÂÃ¯Â¸Â BotÃƒÂ³n de ediciÃƒÂ³n en la esquina */}
            <button
              onClick={() => setEditingField("logo")}
              className="absolute bottom-2 right-2 bg-yellow-400 text-[#00324D] p-2 rounded-full shadow-md hover:bg-yellow-300 transition"
              title="Editar URL de imagen"
            >
              <FaEdit size={16} />
            </button>

            {/* Ã°Å¸â€Â¹ Campo de ediciÃƒÂ³n de la URL */}
            {editingField === "logo" && (
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg shadow-lg w-80 z-50">
                <label className="block font-semibold mb-2 text-sm">URL de la imagen:</label>
                <input
                  type="text"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="border p-2 rounded w-full mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={async () => {
                      if (!editedValue.trim()) {
                        Swal.fire("AtenciÃƒÂ³n", "Por favor escribe una URL vÃƒÂ¡lida", "warning");
                        return;
                      }

                      // Ã¢Å“â€¦ Actualiza la vista
                      setProfileData((prev) => ({ ...prev, logo: editedValue }));
                      setEditingField(null);

                      // Ã¢Å“â€¦ EnvÃƒÂ­a al backend
                      try {
                        const res = await fetch(`${API_URL}/users/${userId}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({ imgUser: editedValue }),

                        });

                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || "Error al actualizar imagen");
                        Swal.fire("Agregada", "Imagen actualizada correctamente", "success");
                      } catch (err: any) {
                        Swal.fire("Error", err.message, "error");
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Nombre, email y nit editables con tamaÃ±o dinÃ¡mico */}
          <div className="relative group max-w-2xl mx-auto">
            <h1 className="font-bold mt-4" style={{ fontSize: `${fontSize * 2}px` }}>
              {editingField === 'nombre' ? (
                /* tu input de ediciÃ³n existente (no cambia) */
                <div className="flex gap-2 justify-center items-center">
                  <input
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="rounded px-3 py-2 text-black w-full max-w-md"
                    style={{ fontSize: `${fontSize}px` }}
                    autoFocus
                    placeholder={empresaPlaceholders.nombre}
                  />
                  <button onClick={handleSave} className="bg-green-600 text-white px-3 py-2 rounded" style={{ fontSize: `${fontSize}px` }}>
                    <FaCheck />
                  </button>
                  <button onClick={handleCancel} className="bg-red-600 text-white px-3 py-2 rounded" style={{ fontSize: `${fontSize}px` }}>
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <span className={!profileData.nombre ? 'italic opacity-80' : ''}>
                  {displayName}
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


          {/* ðŸ”¹ INTERESES DEL USUARIO */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {profileData.intereses.map((interest, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full font-semibold shadow-sm flex items-center gap-2 bg-yellow-400 text-[#00324D]"
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
                      onClick={() => {
                        updateInterest(interest, editedValue);
                        setEditingField(null);
                      }}
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
                    {/* <button
            onClick={() => handleEditClick(`interest-${i}`, interest.name)}
            className={`ml-1 ${
              modoOscuro
                ? "text-blue-900 hover:text-blue-700"
                : "text-[#00324D] hover:text-[#001a27]"
            }`}
          >
            <FaEdit size={12} />
          </button> */}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 bg-[#00324D] text-yellow-400 w-5 h-5 rounded-full flex justify-center items-center hover:bg-[#001a27] transition-all duration-300"
                      title="Eliminar interés"
                    >
                      <FaTimes size={10} />
                    </button>


                  </>
                )}
              </span>
            ))}
          </div>


          {/* 🔹 ICONO PARA DESPLEGAR SELECT DE INTERESES (solo visible si hay menos de 5) */}
          {profileData.intereses.length < 5 && (
            <div className="flex justify-center mt-4 relative">
              <FaPlus
                className="text-yellow-400 text-2xl cursor-pointer hover:scale-125 transition-transform drop-shadow-md"
                onClick={() => setMostrarSelector((prev) => !prev)} // ✅ alterna abrir/cerrar
                title="Agregar intereses"
              />

              {/* 🔹 SELECTOR DESPLEGABLE DE INTERESES */}
              {mostrarSelector && (
                <div
                  className="absolute top-10 left-1/2 transform -translate-x-1/2 mt-2 z-50"
                >
                  <select
                    ref={selectRef}
                    className={`w-72 border rounded-lg p-2 focus:ring-2 focus:ring-white-400 transition-all duration-300
            ${modoOscuro
                        ? "bg-[#0f172a] text-white border-gray-600"
                        : "bg-white text-[#00324D] border-gray-300"
                      }`}
                    onChange={(e) => {
                      const selected = interestsList.find(
                        (int) => int.id === Number(e.target.value)
                      );

                      if (selected) {
                        addInterestFromSelect(selected);
                      }

                      // ✅ cierre automático incluso si no selecciona nada
                      setMostrarSelector(false);
                    }}
                    onBlur={() => setMostrarSelector(false)} // ✅ cierra al perder el foco
                  >
                    <option value="">
                      {modoOscuro ? "🌕 Seleccionar interés..." : "Seleccionar interés..."}
                    </option>

                    {interestsList
                      .filter(
                        (int) =>
                          !profileData.intereses.some((uInt) => uInt.id === int.id)
                      )
                      .map((interes) => (
                        <option
                          key={interes.id}
                          value={interes.id}
                          className={`${modoOscuro
                            ? "bg-[#1e293b] text-white"
                            : "bg-white text-[#00324D]"
                            }`}
                        >
                          {interes.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </header>

        {/* MAIN */}
        <main className="pt-6 px-6 md:px-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
            {/* Columna 1 */}
            <div className="space-y-8">
              <InfoField icon={<FaBuilding />} label="Razón social:" fieldKey="razonSocial" />
              <InfoField icon={<FaMapMarkedAlt />} label="Dirección:" fieldKey="direccion" />
              <InfoField icon={<FaLayerGroup />} label="Departamento:" fieldKey="departamento" />
              <InfoField icon={<FaPhone />} label="Teléfono:" fieldKey="telefono" />
            </div>

            {/* Columna 2 */}
            <div className="space-y-8">
              <InfoField icon={<FaUsers />} label="Número de empleados:" fieldKey="numEmpleados" />
              <InfoField icon={<FaCity />} label="Ciudad:" fieldKey="ciudad" />
              <InfoField icon={<FaGlobe />} label="Página web:" fieldKey="paginaWeb" />
              <InfoField icon={<FaLaptopCode />} label="Sector económico:" fieldKey="sector" />
            </div>


            {/* DescripciÃ³n con tamaÃ±o dinÃ¡mico */}
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

            {/* 🆕 Nuevo botón Datos de Empresa */}
            <button
              onClick={() => setMostrarModal(true)} // ✅ abrir modal
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 transform shadow-md"
              style={{ fontSize: `${fontSize}px` }}
            >
              Datos de Empresa
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all hover:scale-105 transform"
              style={{ fontSize: `${fontSize}px` }}
            >
              Cerrar Sesión
            </button>

            {/* ✅ Modal */}
            {mostrarModal && (
              <DatosEmpresaModal
                cerrarModal={() => setMostrarModal(false)}
                onEmpresaActualizada={(nuevaEmpresa) => {
                  setEmpresa(nuevaEmpresa);
                  setProfileData((prev) => ({
                    ...prev,
                    nombre: nuevaEmpresa.name ?? prev.nombre,
                    email: nuevaEmpresa.email ?? prev.email,
                    nit: nuevaEmpresa.taxId ?? prev.nit,
                    razonSocial: nuevaEmpresa.legalName ?? prev.razonSocial,
                    direccion: nuevaEmpresa.address ?? prev.direccion,
                    telefono: nuevaEmpresa.phone ?? prev.telefono,
                    paginaWeb: nuevaEmpresa.website ?? prev.paginaWeb,
                    numEmpleados: nuevaEmpresa.employeeCount
                      ? String(nuevaEmpresa.employeeCount)
                      : prev.numEmpleados,
                    sector: nuevaEmpresa.economicSector ?? prev.sector,
                    descripcion: nuevaEmpresa.description ?? prev.descripcion,
                    ciudad: nuevaEmpresa.city?.name ?? prev.ciudad,
                    departamento: nuevaEmpresa.departmentName ?? prev.departamento,
                  }));
                }}
              />
            )}

          </div>

        </main>
      </div>
    </div>
  );
}