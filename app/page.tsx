// Importa o componente link do next
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo Celke</h1>
      <Link href="/login">Login</Link>
    </div>
  );
}
