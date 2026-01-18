import { createContext, useContext, useState } from 'react';

const CursorContext = createContext();

export const useCursor = () => {
    const context = useContext(CursorContext);
    if (!context) {
        throw new Error('useCursor must be used within a CursorProvider');
    }
    return context;
};

export const CursorProvider = ({ children }) => {
    const [cursorType, setCursorType] = useState('default'); // default, pointer, text, card, hidden

    const setCursor = (type) => setCursorType(type);

    // Helper props for components to easily add cursor interactions
    const textCursor = {
        onMouseEnter: () => setCursor('text'),
        onMouseLeave: () => setCursor('default')
    };

    const pointerCursor = {
        onMouseEnter: () => setCursor('pointer'),
        onMouseLeave: () => setCursor('default')
    };

    const cardCursor = {
        onMouseEnter: () => setCursor('card'),
        onMouseLeave: () => setCursor('default')
    };

    return (
        <CursorContext.Provider value={{ cursorType, setCursor, textCursor, pointerCursor, cardCursor }}>
            {children}
        </CursorContext.Provider>
    );
};
