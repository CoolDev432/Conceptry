import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { database } from "@/appwriteConf";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const difficulty = searchParams.get("difficulty") || "normal"; 

    try {
        const result = await database.listDocuments(
            "conceptry",
            "68469aa9002608b20bee",
            [Query.equal("$id", id)]
        );

        const note = result.documents[0];
        if (!note) {
            return NextResponse.json({ error: "Note not found." }, { status: 404 });
        }

        const content = note.content;

        const difficultyPrompts = {
            easy: `
Based on the following content, generate a quiz with 5 EASY multiple-choice questions in JSON format.

CRITICAL RULES:
- The 'correctAnswer' field MUST be EXACTLY identical to one of the 4 options.
- Double-check that correctAnswer matches an option word-for-word.
- Focus on basic definitions and simple recall.
- Use clear, straightforward language.

Content:
"""${content}"""

Example format (follow this structure exactly):
[
  {
    "question": "What is the definition of X?",
    "options": [
      "Option A text here",
      "Option B text here",
      "Option C text here",
      "Option D text here"
    ],
    "correctAnswer": "Option B text here",
    "explanation": "Simple explanation here..."
  }
]

Generate 5 questions following this exact format. Ensure correctAnswer is copy-pasted from options.`,

            normal: `
Based on the following content, generate a quiz with 5 NORMAL difficulty multiple-choice questions in JSON format.

CRITICAL RULES:
- The 'correctAnswer' field MUST be EXACTLY identical to one of the 4 options.
- Double-check that correctAnswer matches an option word-for-word.
- Mix recall, understanding, and basic application.
- Standard academic level.

Content:
"""${content}"""

Example format (follow this structure exactly):
[
  {
    "question": "Which statement best describes X?",
    "options": [
      "Statement A about the topic",
      "Statement B about the topic",
      "Statement C about the topic",
      "Statement D about the topic"
    ],
    "correctAnswer": "Statement B about the topic",
    "explanation": "Detailed explanation here..."
  }
]

Generate 5 questions following this exact format. Ensure correctAnswer is copy-pasted from options.`,

            hard: `
Based on the following content, generate a quiz with 5 HARD difficulty multiple-choice questions in JSON format.

CRITICAL RULES:
- The 'correctAnswer' field MUST be EXACTLY identical to one of the 4 options.
- Double-check that correctAnswer matches an option word-for-word.
- Focus on analysis, synthesis, and complex applications.
- Include scenario-based questions.

Content:
"""${content}"""

Example format (follow this structure exactly):
[
  {
    "question": "In the given scenario, what would be the most appropriate analysis?",
    "options": [
      "Analysis option A with detailed reasoning",
      "Analysis option B with detailed reasoning",
      "Analysis option C with detailed reasoning",
      "Analysis option D with detailed reasoning"
    ],
    "correctAnswer": "Analysis option B with detailed reasoning",
    "explanation": "Comprehensive explanation of the reasoning process..."
  }
]

Generate 5 questions following this exact format. Ensure correctAnswer is copy-pasted from options.`
        };

        const selectedPrompt = difficultyPrompts[difficulty] || difficultyPrompts.normal;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: (difficulty === 'hard') ? 0.8 : 0.7, // Only hard mode changes temperature
                maxOutputTokens: 2048,
            }
        });

        // Set a fixed timeout for all difficulties
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const resultAI = await model.generateContent(selectedPrompt);
        let response = await resultAI.response.text();

        response = response.trim().replace(/^```json\s*|\s*```$/g, '');

        let quizData;
        try {
            quizData = JSON.parse(response);
        } catch (jsonErr) {
            console.error("Failed to parse JSON response:", response);
            throw new Error("AI returned invalid JSON format.");
        }
        
        if (!Array.isArray(quizData) || quizData.length !== 5) {
            console.error("AI returned incorrect number of questions:", quizData);
            throw new Error("Invalid quiz format generated (expected 5 questions)");
        }

        for (let i = 0; i < quizData.length; i++) {
            const q = quizData[i];
            if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
                console.error(`Question ${i + 1} missing required fields:`, q);
                throw new Error(`Question ${i + 1} missing required fields`);
            }
            if (!Array.isArray(q.options) || q.options.length !== 4) {
                console.error(`Question ${i + 1} must have exactly 4 options:`, q.options);
                throw new Error(`Question ${i + 1} must have exactly 4 options`);
            }

            if (!q.options.includes(q.correctAnswer)) {
                console.log(`⚠️ Question ${i + 1} answer mismatch. Correct: "${q.correctAnswer}", Options:`, q.options);

                const normalizedCorrect = q.correctAnswer.toLowerCase().trim();
                const matchingOption = q.options.find(option =>
                    option.toLowerCase().trim() === normalizedCorrect ||
                    (normalizedCorrect.includes(option.toLowerCase().trim()) && normalizedCorrect.length - option.length < 5) || 
                    (option.toLowerCase().trim().includes(normalizedCorrect) && option.length - normalizedCorrect.length < 5)
                );

                if (matchingOption) {
                    console.log(`✅ Fixed Question ${i + 1}: "${q.correctAnswer}" → "${matchingOption}"`);
                    q.correctAnswer = matchingOption;
                } else {
                    console.log(`🔧 Fallback for Question ${i + 1}: Using first option for now`);
                    q.correctAnswer = q.options[0]; 
                    q.explanation = `(Note: Answer auto-corrected due to generation error) ${q.explanation}`;
                }
            }
        }

        return NextResponse.json(quizData);

    } catch (err) {
        console.error("❌ Error generating quiz:", err);

        let errorMessage = "Failed to generate quiz due to an internal server error. Please try again.";
        if (err.message.includes("JSON") || err.message.includes("Invalid quiz format")) {
            errorMessage = "Failed to generate a properly formatted quiz. The AI might have returned an invalid structure. Please try again.";
        } else if (err.message.includes("fetch failed")) {
            errorMessage = "Network error or API limit reached. Please wait a moment and try again.";
        } else if (err.message.includes("Note not found")) {
            errorMessage = "The note could not be found. Please ensure you are navigating from a valid note page.";
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}