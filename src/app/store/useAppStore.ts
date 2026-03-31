import { create } from "zustand";

    export interface DocumentItem {
        id: string;
        title: string;
    }

    interface AppState {
        documents: DocumentItem[];
        activeDocumentId: string | null;

        createDocument: () => void;
        setActiveDocument: (id: string) => void;
    }

    export const useAppStore = create<AppState>((set) => {
        const firstDoc = {
            id: crypto.randomUUID(),
            title: "Nouvelle page",
        };

        return {
            documents: [firstDoc],
            activeDocumentId: firstDoc.id,

            createDocument: () =>
            set((state) => {
                const newDoc = {
                    id: crypto.randomUUID(),
                    title: "Nouvelle page",
                };

                return {
                    documents: [...state.documents, newDoc],
                    activeDocumentId: newDoc.id,
                };
            }),

            setActiveDocument: (id) =>
                set({
                    activeDocumentId: id,
            }),
        };
    });