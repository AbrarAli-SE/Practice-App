// flashcardData.ts
import { Flashcard } from './types';

export const initialFlashcards: Flashcard[] = [
    {
        id: '1',
        question: 'What is React Native?',
        answer: 'A framework for building native mobile apps using React and JavaScript.',
    },
    {
        id: '2',
        question: 'What is JSX?',
        answer: 'JavaScript XML - a syntax extension that allows writing HTML-like code in JavaScript.',
    },
    {
        id: '3',
        question: 'What is a Component in React?',
        answer: 'A reusable piece of UI that can have its own logic and styling.',
    },
    {
        id: '4',
        question: 'What is State in React?',
        answer: 'An object that holds data that may change over the component lifecycle.',
    },
    {
        id: '5',
        question: 'What are Props?',
        answer: 'Properties passed from parent to child components to share data.',
    },
    {
        id: '6',
        question: 'What is useState Hook?',
        answer: 'A Hook that lets you add state to functional components.',
    },
    {
        id: '7',
        question: 'What is useEffect Hook?',
        answer: 'A Hook for performing side effects in functional components.',
    },
    {
        id: '8',
        question: 'What is Virtual DOM?',
        answer: 'A lightweight copy of the actual DOM used for efficient updates.',
    },
    {
        id: '9',
        question: 'What is FlatList?',
        answer: 'A performant component for rendering scrollable lists in React Native.',
    },
    {
        id: '10',
        question: 'What is Flexbox?',
        answer: 'A layout system for arranging items in rows or columns with flexible sizing.',
    },
];

export const getNewRandomCard = (): Flashcard => {
    const questions: Omit<Flashcard, 'id'>[] = [
        {
            question: 'What is AsyncStorage?',
            answer: 'A persistent key-value storage system for React Native.',
        },
        {
            question: 'What is Redux?',
            answer: 'A state management library for JavaScript applications.',
        },
        {
            question: 'What is Context API?',
            answer: 'A way to pass data through component tree without props drilling.',
        },
        {
            question: 'What is React Navigation?',
            answer: 'A routing and navigation library for React Native apps.',
        },
        {
            question: 'What is TypeScript?',
            answer: 'A typed superset of JavaScript that compiles to plain JavaScript.',
        },
    ];

    const random = questions[Math.floor(Math.random() * questions.length)];
    return {
        id: Date.now().toString(),
        ...random,
    };
};