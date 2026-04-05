import { useAppStore } from "../../app/store/useAppStore";
import { useEffect, useRef } from "react";

export default function EditorPage() {
  const {
    documents,
    createDocument,
    setActiveDocument,
    activeDocumentId,
    updateDocumentTitle,
    addBlock,
    updateBlock,
  } = useAppStore();

  const activeDocument = documents.find((doc) => doc.id === activeDocumentId);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!activeDocument) return;

      const lastBlock =
        activeDocument.blocks[activeDocument.blocks.length - 1];

      const lastBlockInputRef = inputRefs.current[lastBlock.id];

    if (lastBlockInputRef) {
      lastBlockInputRef.focus();
    }
  }, [activeDocument?.blocks.length]);

  return (
    <div className="flex h-screen bg-white text-black">
      <aside className="w-64 border-r border-neutral-200 bg-neutral-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Pages
          </h2>

          <button
            onClick={createDocument}
            className="rounded px-2 py-1 text-sm hover:bg-neutral-200"
            type="button"
          >
            +
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocument(doc.id)}
              type="button"
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

      <main className="flex-1 overflow-y-auto p-8">
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

              <div className="mt-6 space-y-2">
                {activeDocument.blocks.map((block) => (
                  <input
                    key={block.id}
                    type="text"
                    value={block.content}
                    onChange={(event) =>
                      updateBlock(
                        activeDocument.id,
                        block.id,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addBlock(activeDocument.id);
                      }
                    }}
                    ref={(el) => {
                      inputRefs.current[block.id] = el;
                    }}
                    className="w-full border-none bg-transparent py-1 outline-none"
                    placeholder="Tapez '/' pour les commandes"
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-neutral-600">Aucun document sélectionné.</p>
          )}
        </div>
      </main>
    </div>
  );
}