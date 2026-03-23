export interface DomainScore {
    score: number | null;
    max: number;
    auto: boolean;
}

export interface ScoringResult {
    totalScore: number;
    maxScore: number;
    demographicAdjustment: number;
    domains: {
        orientation: DomainScore;
        language: DomainScore;
        memory: DomainScore;
        reasoning: DomainScore;
        visuospatial: DomainScore;
        executive: DomainScore;
    };
    classification: string;
}

export const calculateSAGEScore = (answers: Record<string, any>): ScoringResult => {
    // 1. Demographic Adjustment
    // Age > 80 => +1
    // Education <= 12 => +1
    let adjustment = 0;
    const dob = answers['dob'] ? new Date(answers['dob']) : null;
    let age = 0;
    if (dob) {
        const diff = Date.now() - dob.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    if (age > 80) adjustment += 1;

    const edu = answers['education_years'] ? parseInt(answers['education_years']) : 13; // Default to >12 if missing
    if (edu <= 12) adjustment += 1;

    // 2. Orientation (Max 4)
    // Date match: Day (1), Month (1), Year (1), DayOfWeek (1)
    // Currently auto-score is placeholder 0 because parsing text dates is hard without strict format
    // For this implementation, let's try a simple match if possible, otherwise 0.
    const orientationScore = 0; // Placeholder, requires manual review or strict input

    // 3. Language (Max 4)
    // Naming (2 points): "Accordion", "Volcano"
    // Fluency (2 points): 12 animals => 2, 8-11 => 1
    let languageScore = 0;

    // Naming
    const checkKeyword = (text: string, keywords: string[]) => {
        if (!text) return false;
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k));
    };

    if (checkKeyword(answers['img_accordion'], ['accordion', 'concertina'])) languageScore += 1; 
    if (checkKeyword(answers['img_volcano'], ['volcano', 'volcanoes'])) languageScore += 1;

    // Fluency (Animals) - simplistic count of commas or newlines
    const fluencyText = Array.from({ length: 12 }, (_, i) => answers[`animal_${i + 1}`] || '').join(', ');
    const animals = fluencyText.split(/[\n,]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    const uniqueAnimals = new Set(animals.map((a: string) => a.toLowerCase())).size;

    if (uniqueAnimals >= 12) languageScore += 2;
    else if (uniqueAnimals >= 8) languageScore += 1;

    // 4. Reasoning/Calculation (Max 4)
    // Abstraction (Similarities) 
    // Calculation (20 euro - 13.45 = 6.55)
    let reasoningScore = 0;
    const calc = answers['calc_change']; // Expect 6.55
    if (calc && (calc.includes('6.55') || calc.includes('6,55'))) reasoningScore += 1; 
    
    // Similarity check (simplistic)
    const simWatchRuler = answers['sim_watch_ruler'] || '';
    if (checkKeyword(simWatchRuler, ['measure', 'measuring', 'instrument', 'tool'])) reasoningScore += 1;

    // 5. Manual Domains (Memory, Visuospatial, Executive) initial score 0

    return {
        totalScore: adjustment + orientationScore + languageScore + reasoningScore,
        maxScore: 22,
        demographicAdjustment: adjustment,
        domains: {
            orientation: { score: orientationScore, max: 4, auto: true },
            language: { score: languageScore, max: 4, auto: true },
            reasoning: { score: reasoningScore, max: 4, auto: true },
            memory: { score: 0, max: 2, auto: false },
            visuospatial: { score: 0, max: 4, auto: false },
            executive: { score: 0, max: 4, auto: false }
        },
        classification: "Pending Review"
    };
};
