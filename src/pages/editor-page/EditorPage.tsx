import { useAppStore } from "../../app/store/useAppStore";

export default function EditorPage() {
  const { documents, activeDocumentId, createDocument, setActiveDocument, updateDocumentTitle } = useAppStore();

  const activeDocument = documents.find((doc) => doc.id === activeDocumentId);

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
          {activeDocument ? (
            <>
              <input
                type="text"
                value={activeDocument.title}
                onChange={(event) =>
                  updateDocumentTitle(activeDocument.id, event.target.value)
                }
                className="w-full border-none bg-transparent text-4xl font-bold outline-none"
                placeholder="Titre de la page"
              />

              <p className="mt-3 text-neutral-600">
                Le contenu du document arrivera ici.
              </p>
            </>
          ) : (
            <p className="text-neutral-600">Aucun document sélectionné.</p>
          )}
        </div>
      </main>
      </div>
    );
  }