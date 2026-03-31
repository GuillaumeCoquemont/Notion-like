export default function EditorPage() {
  return (
    <div className="flex h-screen bg-white text-black">
      <aside className="w-64 border-r border-neutral-200 bg-neutral-100 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
          Pages
        </h2>

        <div className="mt-4 rounded-md bg-white p-3 shadow-sm">
          <p className="text-sm font-medium">Nouvelle page</p>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Editor</h1>
          <p className="mt-2 text-neutral-600">
            La zone d’édition arrivera ici.
          </p>
        </div>
      </main>
    </div>
  );
}