import { useAppStore } from "../../app/store/useAppStore";

export default function EditorPage() {
  const { documents, activeDocumentId, createDocument, setActiveDocument } = useAppStore();

    return (
      <div className="flex h-screen bg-white text-black">
        <aside className="w-64 border-r border-neutral-200 bg-neutral-100 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Pages
            </h2>

            <button onClick={createDocument} className="rounded px-2 py-1 text-sm hover:bg-neutral-200" type="button">+</button>
          </div>
          <div className="mt-4 space-y-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocument(doc.id)}
                className={`block w-full rounded-md p-2 text-left text-sm ${
                  activeDocumentId === doc.id
                    ? "bg-black text-white"
                    : "bg-white hover:bg-neutral-200"
                }`}
              >
                {doc.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold">Editor</h1>
            <p className="mt-2 text-neutral-600">
              Page active : {activeDocumentId}
            </p>
          </div>
        </main>
      </div>
    );
  }