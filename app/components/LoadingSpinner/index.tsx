// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-blue-700 border-solid rounded-full animate-spin"></div>
      {/* <p className="ml-4 text-blue-700">Carregando...</p> */}
    </div>
  );
};

export default LoadingSpinner;
