import { useAppStore } from "../../app/store/useAppStore";
import { useEffect, useRef, useState } from "react";

export default function EditorPage() {
  // Global store: data and actions for documents and blocks
  const {
    documents,
    createDocument,
    setActiveDocument,
    activeDocumentId,
    updateDocumentTitle,
    addBlock,
    updateBlock,
    deleteBlock,
    setBlockType,
    toggleBlock,
  } = useAppStore();

  // Currently selected document
  const activeDocument = documents.find((doc) => doc.id === activeDocumentId);

  // References to block inputs for focus management
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Local UI state for the slash menu
  const [slashMenu, setSlashMenu] = useState<{
    blockId: string;
    selectedIndex: number;
  } | null>(null);
  
  // Available options shown in the slash menu
  const slashMenuOptions = [
    { label: "Texte", type: "text" as const },
    { label: "Titre", type: "heading" as const },
    { label: "Tâche", type: "todo" as const },
    { label: "Liste", type: "bullet" as const },
  ];

  // Auto-focus the last block when a new one is created
  useEffect(() => {
    if (!activeDocument || activeDocument.blocks.length === 0) return;

    const lastBlock =
      activeDocument.blocks[activeDocument.blocks.length - 1];

    const lastBlockInputRef = inputRefs.current[lastBlock.id];

    if (lastBlockInputRef) {
      lastBlockInputRef.focus();
    }
  }, [activeDocument?.blocks.length]);

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar: documents list and creation */}
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

      {/* Editor area: title, blocks and slash menu */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl">
          {activeDocument ? (
            <>
              {/* Document title */}
              <input
                type="text"
                value={activeDocument.title}
                onChange={(event) =>
                  updateDocumentTitle(activeDocument.id, event.target.value)
                }
                className="w-full border-none bg-transparent text-4xl font-bold outline-none"
                placeholder="Titre de la page"
              />

              {/* Document blocks */}
              <div className="mt-6 space-y-2">
                {activeDocument.blocks.map((block) => (
                  <div key={block.id}>
                    <div className="flex items-center gap-2">
                      {block.type === "todo" && (
                        <input
                          type="checkbox"
                          checked={block.checked ?? false}
                          onChange={() => toggleBlock(activeDocument.id, block.id)}
                          className="h-4 w-4 cursor-pointer"
                        />
                      )}
                      {block.type === "bullet" && (
                        <span className="text-neutral-400 ml-2">•</span>
                      )}
                      {/* Block input */}
                    <input
                      type="text"
                      value={block.content}
                      onChange={(event) => {
                        const value = event.target.value;

                        updateBlock(activeDocument.id, block.id, value);

                        if (value.endsWith("/")) {
                          setSlashMenu({ blockId: block.id, selectedIndex: 0 });
                        } else {
                          setSlashMenu(null);
                        }
                      }}

                      onKeyDown={(event) => {
                        // Slash menu keyboard navigation has priority
                        if (slashMenu?.blockId === block.id) {
                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            setSlashMenu((current) => {
                              if (!current || current.blockId !== block.id) return current;
                            return {
                              ...current,
                              selectedIndex:
                              current.selectedIndex === 0
                              ? slashMenuOptions.length - 1
                              : current.selectedIndex - 1
                            }
                           });
                           return;
                          }

                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            setSlashMenu((current) => {
                              if (!current || current.blockId !== block.id) return current;
                              return {
                                ...current,
                                selectedIndex:
                                current.selectedIndex === slashMenuOptions.length - 1
                                ? 0
                                : current.selectedIndex + 1
                              }
                            });
                            return;
                          }

                          if (event.key === "Enter") {
                            event.preventDefault();

                            const selectedOption =
                              slashMenuOptions[slashMenu.selectedIndex];

                            setBlockType(
                              activeDocument.id,
                              block.id,
                              selectedOption.type,
                            );
                            updateBlock(activeDocument.id, block.id, block.content.slice(0, -1));
                            setSlashMenu(null);
                            return;
                          }

                          if (event.key === "Escape") {
                            event.preventDefault();
                            setSlashMenu(null);
                            return;
                          }
                        }

                        // Normal block keyboard behavior
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addBlock(activeDocument.id);
                        }

                        // Delete empty block and focus previous one
                        if (event.key === "Backspace" && block.content === "") {
                          event.preventDefault();

                          const currentIndex = activeDocument.blocks.findIndex(
                            (b) => b.id === block.id
                          );

                          if (currentIndex > 0) {
                            const previousBlock = activeDocument.blocks[currentIndex - 1];

                            deleteBlock(activeDocument.id, block.id);

                            setTimeout(() => {
                              const previousInputRef = inputRefs.current[previousBlock.id];
                              previousInputRef?.focus();
                            }, 0);
                          }
                        }

                        // Navigate between blocks when slash menu is closed
                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          const currentIndex = activeDocument.blocks.findIndex(
                            (b) => b.id === block.id
                          );

                          if (currentIndex > 0) {
                            const previousBlock = activeDocument.blocks[currentIndex - 1];
                            const previousInputRef = inputRefs.current[previousBlock.id];
                            previousInputRef?.focus();
                          }
                        }

                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          const currentIndex = activeDocument.blocks.findIndex(
                            (b) => b.id === block.id
                          );

                          if (currentIndex < activeDocument.blocks.length - 1) {
                            const nextBlock = activeDocument.blocks[currentIndex + 1];
                            const nextInputRef = inputRefs.current[nextBlock.id];
                            nextInputRef?.focus();
                          }
                        }
                      }}
                      ref={(el) => {
                        inputRefs.current[block.id] = el;
                      }}
                      className={`w-full border-none bg-transparent py-1 outline-none ${
                        block.type === "heading" ? "text-2xl font-bold" : ""
                      } ${
                        block.type === "todo" && block.checked ? "line-through text-neutral-400" : ""
                      }`}
                      placeholder="Tapez '/' pour les commandes"
                    />
                    </div>

                    {/* Slash menu for the current block */}
                    {slashMenu?.blockId === block.id && (
                      <div className="mt-2 rounded border bg-white p-2 shadow">
                        {slashMenuOptions.map((option, index) => (
                          <button
                            key={option.type}
                            type="button"
                            className={`block w-full rounded p-1 text-left ${
                              slashMenu.selectedIndex === index
                                ? "bg-gray-200"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setBlockType(activeDocument.id, block.id, option.type);
                              updateBlock(activeDocument.id, block.id, block.content.slice(0, -1));
                              setSlashMenu(null);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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