// Importa o componente link do next
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo Celke</h1>
      <p>
        <Link href="/new-users">Sign Up</Link> <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
