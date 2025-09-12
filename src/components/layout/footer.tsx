"use client";

type FooterProps = {
  sectionBg: string;
};

export default function Footer({ sectionBg }: FooterProps) {
  return (
    <footer className={`${sectionBg} py-8 relative z-10`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="opacity-70 mb-2">
            © {new Date().getFullYear()} Sistema de Administración
          </p>
          <p className="text-sm opacity-50">
            Desarrollado con para una gestión eficiente
          </p>
        </div>
      </div>
    </footer>
  );
}
