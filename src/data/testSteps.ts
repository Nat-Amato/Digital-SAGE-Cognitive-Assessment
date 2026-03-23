export interface QuestionStep {
    id: number;
    title: string;
    description?: string;
    type: 'demographics' | 'memory' | 'clock' | 'text' | 'choice' | 'date' | 'copy_drawing' | 'trail_making' | 'problem_solving';
    fields?: {
        label: string;
        key: string;
        type?: 'text' | 'number' | 'date' | 'select' | 'radio';
        placeholder?: string;
        options?: string[]; // For select/radio
        conditional?: { key: string; value: any }; // Simple conditional logic placeholder
    }[];
    image?: string; // For single image
    images?: { src: string; label: string; key: string }[]; // For multiple images
    correctAnswer?: string;

    // Trail Making Specific
    nodes?: { id: string; label: string; x: number; y: number; subLabel?: string }[]; // Active test nodes
    exampleNodes?: { id: string; label: string; x: number; y: number; subLabel?: string }[]; // Example nodes
    examplePath?: { from: string; to: string }[]; // Connections for example

    // Problem Solving Specific
    problemLines?: { x1: number; y1: number; x2: number; y2: number }[];
    exampleFigures?: {
        lines: { x1: number; y1: number; x2: number; y2: number; isSolution?: boolean; crossedOut?: boolean }[];
        arrows?: { x: number, y: number, direction: 'up' | 'down' | 'left' | 'right' }[];
        label?: string;
        caption: string;
        subCaption?: string;
    }[];
}

export const sageTestSteps: QuestionStep[] = [
    {
        id: 1,
        type: 'demographics',
        title: 'Anamnesis and Personal Data',
        description: 'Complete the following data before starting the test.',
        fields: [
            { label: 'Full Name', key: 'fullname', type: 'text', placeholder: 'John Doe' },
            { label: 'Date of Birth', key: 'dob', type: 'date' },
            { label: 'How many years of education have you attended?', key: 'education_years', type: 'number', placeholder: 'E.g. 13' },
            {
                label: 'Gender',
                key: 'gender',
                type: 'select',
                options: ['Male', 'Female']
            },
            {
                label: 'Ethnicity',
                key: 'ethnicity',
                type: 'select',
                options: ['Caucasian', 'White', 'Asian', 'Black', 'South American', 'Hispanic', 'Other']
            },
            {
                label: 'Have you had memory or thinking problems?',
                key: 'history_memory',
                type: 'select',
                options: ['Yes', 'Occasionally', 'No']
            },
            {
                label: 'Have you had relatives with memory problems?',
                key: 'family_memory',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                label: 'Do you have balance problems?',
                key: 'balance_problems',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                label: 'If yes, do you know why? (Specify)',
                key: 'balance_reason',
                type: 'text',
                placeholder: 'Optional'
            },
            {
                label: 'Have you ever had a major stroke?',
                key: 'stroke_major',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                label: 'Have you ever had a minor stroke?',
                key: 'stroke_minor',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                label: 'Currently feel sad or depressed?',
                key: 'depression',
                type: 'select',
                options: ['Yes', 'Occasionally', 'No']
            },
            {
                label: 'Have there been any changes in your personality?',
                key: 'personality_changes',
                type: 'select',
                options: ['Yes', 'No']
            },
            {
                label: 'If yes, specify which ones',
                key: 'personality_changes_spec',
                type: 'text',
                placeholder: 'Optional'
            },
            {
                label: 'Do you have more difficulty performing activities of daily living due to difficulties in thinking?',
                key: 'daily_activity_difficulty',
                type: 'select',
                options: ['Yes', 'No']
            }
        ]
    },
    {
        id: 2,
        type: 'text',
        title: 'Orientation',
        description: 'Write today\'s date from memory.',
        fields: [
            { label: 'Today\'s Date', key: 'memory_date', type: 'text', placeholder: 'E.g. May 15, 2024' }
        ]
    },
    {
        id: 3,
        type: 'memory',
        title: 'Naming and Memory',
        description: 'Write the names of the following figures:',
        images: [
            { src: '/images/fisarmonica.png', label: 'Figure 1', key: 'img_accordion' },
            { src: '/images/vulcano.png', label: 'Figure 2', key: 'img_volcano' }
        ]
    },
    {
        id: 4,
        type: 'text',
        title: 'Reasoning and Calculation',
        description: 'Answer the following questions.',
        fields: [
            {
                label: 'In what way are a watch and a ruler alike? Write how they are similar. They are both...',
                key: 'sim_watch_ruler',
                type: 'text',
                placeholder: 'Write your answer...'
            },
            {
                label: 'How many 20-cent coins are in one euro?',
                key: 'calc_coins',
                type: 'text'
            },
            {
                label: 'Imagine buying 13.45 euros of groceries and paying with a 20 euro bill. How much change would you receive?',
                key: 'calc_change',
                type: 'text'
            }
        ]
    },
    {
        id: 5,
        type: 'text',
        title: 'Memory Test',
        description: 'Memorize the following instructions and complete them **ONLY** after finishing the whole questionnaire:\n\nAt the end of the last page, write on the blank line: "**I have finished**"',
        fields: []
    },
    {
        id: 6,
        type: 'copy_drawing',
        title: 'Copy of Drawing',
        description: 'Copy this drawing into the box on the right.',
        image: '/images/cube-iso.svg'
    },
    {
        id: 7,
        type: 'clock',
        title: 'Clock Drawing',
        description: 'Draw a large clock face and put in the hour numbers.\nPosition the hands at 11 o\'clock and 5 minutes.\nIndicate the minute hand with an M and the hour hand with an H.',
    },
    {
        id: 8,
        type: 'text',
        title: 'Verbal Fluency',
        description: 'Write the names of 12 different animals.',
        fields: Array.from({ length: 12 }, (_, i) => ({
            label: `Animal ${i + 1}`,
            key: `animal_${i + 1}`,
            type: 'text',
        }))
    },
    {
        id: 9,
        type: 'trail_making',
        title: 'Connection Test',
        description: 'Look at this example (this has been done for you). Then go to the next question: Draw a line from one circle to another starting from 1 and alternating numbers and letters (from 1 to A, then to 2, then to B, then to 3, then to C).',
        exampleNodes: [
            { id: '1', label: '1', x: 20, y: 20, subLabel: 'START' },
            { id: 'A', label: 'A', x: 50, y: 10 },
            { id: '2', label: '2', x: 80, y: 30 },
            { id: 'B', label: 'B', x: 50, y: 50 },
            { id: '3', label: '3', x: 20, y: 60 },
            { id: 'C', label: 'C', x: 60, y: 70, subLabel: 'FINISH' }
        ],
        examplePath: [
            { from: '1', to: 'A' },
            { from: 'A', to: '2' },
            { from: '2', to: 'B' },
            { from: 'B', to: '3' },
            { from: '3', to: 'C' }
        ],
        nodes: [
            // Outer Ring - roughly clockwise from Bottom Left
            { id: '1', label: '1', x: 10, y: 70, subLabel: 'START' },
            { id: 'A', label: 'A', x: 10, y: 42 },
            { id: '2', label: '2', x: 15, y: 12 },
            { id: 'B', label: 'B', x: 45, y: 15 },
            { id: '3', label: '3', x: 80, y: 15 },
            { id: 'C', label: 'C', x: 90, y: 42 },
            { id: '4', label: '4', x: 85, y: 70 },

            // Inner Ring - spiraling in
            { id: 'D', label: 'D', x: 50, y: 72 },
            { id: '5', label: '5', x: 30, y: 62 },
            { id: 'E', label: 'E', x: 40, y: 45 },
            { id: '6', label: '6', x: 65, y: 55 },
            { id: 'F', label: 'F', x: 60, y: 25, subLabel: 'FINISH' }
        ]
    },
    {
        id: 10,
        type: 'problem_solving',
        title: 'Problem Solving',
        description: 'Look at this example (this has been done for you). Then go to the question in the next step:\n\nStarting with a triangle and a square\nMove two lines (marking them with a cross)\nTo make two squares and no triangles appear\nEach line must be part of a complete square with no extra lines',
        exampleFigures: [
            {
                lines: [
                    // Triangle (pointing down) - Shifted X+10
                    { x1: 30, y1: 50, x2: 50, y2: 50 },
                    { x1: 50, y1: 50, x2: 40, y2: 70 },
                    { x1: 40, y1: 70, x2: 30, y2: 50 },
                    // Square (bottom-left at triangle top-right) - Shifted X+10
                    { x1: 50, y1: 30, x2: 70, y2: 30 }, // Top
                    { x1: 70, y1: 30, x2: 70, y2: 50 }, // Right
                    { x1: 70, y1: 50, x2: 50, y2: 50 }, // Bottom
                    { x1: 50, y1: 50, x2: 50, y2: 30 }, // Left
                ],
                label: '(Example)',
                caption: '1 triangle, 1 square'
            },
            {
                lines: [
                    // Triangle (pointing down, bottom lines crossed out) - Shifted X+10
                    { x1: 30, y1: 50, x2: 50, y2: 50 },
                    { x1: 50, y1: 50, x2: 40, y2: 70, crossedOut: true },
                    { x1: 40, y1: 70, x2: 30, y2: 50, crossedOut: true },
                    // Square (same as before) - Shifted X+10
                    { x1: 50, y1: 30, x2: 70, y2: 30 },
                    { x1: 70, y1: 30, x2: 70, y2: 50 },
                    { x1: 70, y1: 50, x2: 50, y2: 50 },
                    { x1: 50, y1: 50, x2: 50, y2: 30 },
                ],
                label: '(Example)',
                caption: 'Move these two lines'
            },
            {
                lines: [
                    // Left Square - Shifted X+10, Y+10
                    { x1: 30, y1: 40, x2: 50, y2: 40 }, // Top
                    { x1: 50, y1: 40, x2: 50, y2: 60 }, // Right
                    { x1: 50, y1: 60, x2: 30, y2: 60 }, // Bottom
                    { x1: 30, y1: 60, x2: 30, y2: 40 }, // Left
                    // Right Square - Shifted X+10, Y+10
                    { x1: 50, y1: 40, x2: 70, y2: 40 }, // Top
                    { x1: 70, y1: 40, x2: 70, y2: 60 }, // Right
                    { x1: 70, y1: 60, x2: 50, y2: 60 }, // Bottom
                    // Shared side already drawn
                ],
                arrows: [
                    { x: 40, y: 30, direction: 'down' }, // Points to top side - Shifted X+10, Y+10
                    { x: 20, y: 50, direction: 'right' } // Points to left side - Shifted X+10, Y+10
                ],
                label: '(Example)',
                caption: 'Place them where the arrows are<br/>to get 2 squares (answer)'
            }
        ],
        problemLines: [
            // Square 1 (Bottom-Left in the pair) - approx 20x20
            { x1: 20, y1: 50, x2: 40, y2: 50 }, // Top
            { x1: 40, y1: 50, x2: 40, y2: 70 }, // Right
            { x1: 40, y1: 70, x2: 20, y2: 70 }, // Bottom
            { x1: 20, y1: 70, x2: 20, y2: 50 }, // Left

            // Square 2 (Top-Right relative to Square 1, touching corners) - touches at Sq1(TR) which is (40,50) to Sq2(BL)
            // So Square 2 BL is (40,50). Size 20x20 => TR at (60,30)
            { x1: 40, y1: 30, x2: 60, y2: 30 }, // Top
            { x1: 60, y1: 30, x2: 60, y2: 50 }, // Right
            { x1: 60, y1: 50, x2: 40, y2: 50 }, // Bottom (Shared point at 40,50 with Sq1 TR)
            { x1: 40, y1: 50, x2: 40, y2: 30 }, // Left

            // Triangle 1 (On top of Square 2) - Base is Sq2 Top (40,30)-(60,30)
            { x1: 40, y1: 30, x2: 50, y2: 15 }, // Left slope
            { x1: 50, y1: 15, x2: 60, y2: 30 }, // Right slope
            // Base is already Sq2 Top

            // Triangle 2 (To the right of Square 2) - Base is Sq2 Right (60,30)-(60,50)
            { x1: 60, y1: 30, x2: 75, y2: 40 }, // Upper slope
            { x1: 75, y1: 40, x2: 60, y2: 50 }  // Lower slope
            // Base is already Sq2 Right
        ]
    },
    {
        id: 11,
        type: 'text',
        title: 'Conclusion',
        fields: [
            {
                label: 'Have you finished?',
                key: 'final_check',
                type: 'text',
                placeholder: 'Write here...'
            }
        ]
    }
];
