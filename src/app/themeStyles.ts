export const getThemeStyles = (modoOscuro: boolean) => {
  return {
    // Fondo general
    fondo: modoOscuro ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900",

    // Card (Login) → ahora más sutil
    card: modoOscuro 
      ? "bg-white/10 border-white/20 text-white" 
      : "bg-white border-gray-200 text-gray-900",

    // Títulos
    titulo: modoOscuro
      ? "bg-gradient-to-r from-gray-100 to-gray-300"
      : "bg-gradient-to-r from-[#39A900] to-green-500",

    // Inputs
    input: modoOscuro
      ? "bg-white/5 border border-white/20 text-white placeholder-transparent rounded-lg"
      : "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg",

    // Iconos
    icono: modoOscuro ? "text-gray-200" : "text-gray-500",

    // Botón principal
    boton: modoOscuro
      ? "bg-[#39A900] hover:bg-green-600"
      : "bg-[#39A900] hover:bg-green-700",

    // Texto secundario
    textoSecundario: modoOscuro ? "text-gray-300" : "text-gray-600",

    // Links
    link: modoOscuro ? "text-white" : "text-[#39A900]",
  };
};
