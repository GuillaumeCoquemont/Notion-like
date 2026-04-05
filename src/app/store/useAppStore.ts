import { create } from "zustand";

    export interface Block {
        id: string;
        content: string;
    }

    export interface DocumentItem {
        id: string;
        title: string;
        blocks: Block[];
    }

    interface AppState {
        documents: DocumentItem[];
        activeDocumentId: string | null;

        createDocument: () => void;
        setActiveDocument: (id: string) => void;
        updateDocumentTitle: (id: string, title: string) => void;
        addBlock: (docId: string) => void;
        updateBlock: (docId: string, blockId: string, content: string) => void;
    }

    function createEmptyBlock(): Block {
        return {
            id: crypto.randomUUID(),
            content: "",
        };
    }

    function createNewDocument(): DocumentItem {
        return {
            id: crypto.randomUUID(),
            title: "Nouvelle page",
            blocks: [createEmptyBlock()],
        };
    }

    export const useAppStore = create<AppState>((set) => {
        const firstDoc = createNewDocument();

        return {
            documents: [firstDoc],
            activeDocumentId: firstDoc.id,

            createDocument: () =>
            set((state) => {
                const newDoc = createNewDocument();
                

                return {
                    documents: [...state.documents, newDoc],
                    activeDocumentId: newDoc.id,
                };
            }),

            setActiveDocument: (id) =>
                set({
                    activeDocumentId: id,
            }),

            updateDocumentTitle: (id, title) => 
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc,title } : doc
                ),
            })),

            addBlock: (docId) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === docId ? { ...doc, blocks: [...doc.blocks, createEmptyBlock()] } : doc
                    ),
                })),

            updateBlock: (docId, blockId, content) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === docId ? { ...doc, blocks: doc.blocks.map((block) => block.id === blockId ? { ...block, content } : block) } : doc
                    ),
                })),
        };
    });