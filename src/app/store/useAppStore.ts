import { create } from "zustand";

export type BlockType = "text" | "heading" | "todo";
    export interface Block {
        id: string;
        content: string;
        type: BlockType;
        checked?: boolean;
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
        deleteBlock: (docId: string, blockId: string) => void;
        setBlockType: (docId: string, blockId: string, type: BlockType) => void;
        toggleBlock: (docId: string, blockId: string) => void;
    }

    function createEmptyBlock(): Block {
        return {
            id: crypto.randomUUID(),
            content: "",
            type: "text",
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

            deleteBlock: (docId, blockId) =>
                set((state) => ({
                    documents: state.documents.map((doc) => {
                        if (doc.id !== docId) return doc;

                        const updatedBlocks = doc.blocks.filter(
                            (block) => block.id !== blockId
                        );

                        return {
                            ...doc,
                            blocks:
                                updatedBlocks.length > 0
                                    ? updatedBlocks
                                    : [createEmptyBlock()],
                        };
                    }),
                })),
                
            setBlockType: (docId, blockId, type) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === docId ? { ...doc, blocks: doc.blocks.map((block) => block.id === blockId ? { ...block, type } : block) } : doc
                    ),
                })),

            toggleBlock: (docId, blockId) =>
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === docId ? { ...doc, blocks: doc.blocks.map((block) => block.id === blockId ? { ...block, checked: !block.checked } : block) } : doc
                    ),
                })),
        };
    });