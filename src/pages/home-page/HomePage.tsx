import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Notion Like</h1>
        <p className="text-sm text-neutral-600">
          Éditeur de notes par blocs inspiré de Notion
        </p>

        <Link
          to="/editor"
          className="inline-block rounded-md bg-black px-4 py-2 text-white"
        >
          Ouvrir l’éditeur
        </Link>
      </div>
    </main>
  );
}