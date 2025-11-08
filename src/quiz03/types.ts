// types.ts
export interface Flashcard {
    id: string;
    question: string;
    answer: string;
}

export interface FlashCardProps {
    item: Flashcard;
    onSwipeLeft: (id: string) => void;
    onRemove: (id: string) => void;
}

export interface ProgressHeaderProps {
    scrollY: any; // Animated.Value
    learned: number;
    total: number;
}