
import { createContext, useContext, useState } from 'react';

interface DragDropContextType {
  draggedItems: string[];
  setDraggedItems: (items: string[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const DragDropProvider = ({ children }: { children: React.ReactNode }) => {
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragDropContext.Provider value={{
      draggedItems,
      setDraggedItems,
      isDragging,
      setIsDragging
    }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }
  return context;
};
