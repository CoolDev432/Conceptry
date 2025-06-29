import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ID } from "appwrite";
import {database} from "@/appwriteConf";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const prompt = searchParams.get("prompt");
  const email = searchParams.get("email");
  const noteHead = searchParams.get("head");
  const child = searchParams.get('child');
  const exam = searchParams.get('exam');

  if (!prompt || !email || !noteHead) {
    return NextResponse.json(
      { error: "Missing required parameters (prompt, email, head)" },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    let explanationPrompt;
    if (child === 'true') {
      explanationPrompt = `Explain the concept: "${prompt}" to a 5 year old child, using real life examples and use super simple terms. Don't use asterisks (*) for emphasis or formatting. Use signs like ->, -. For multiplication, use X. DO NOT USE ASTERISKS TO FILL IN SPACES, LIKE **TOPIC**.`;
    } else if (exam === 'true') {
        explanationPrompt = `Explain the concept: "${prompt}" for exam preparation, providing in-depth details, key terms, and potential exam questions. Don't use asterisks (*) for emphasis or formatting. Use signs like ->, -. For multiplication, use X. DO NOT USE ASTERISKS TO FILL IN SPACES, LIKE **TOPIC**.`;
    }
    else {
      explanationPrompt = `Explain the concept: "${prompt}" in simple terms using real life examples. Very Important: Stress on the core concept of your explanation, giving an in depth explanation is important. Don't use asterisks (*) for emphasis or formatting. Use signs like ->, -. For multiplication, use X. DO NOT USE ASTERISKS TO FILL IN SPACES, LIKE **TOPIC**.`;
    }

    const explanationResult = await model.generateContent(explanationPrompt);
    const explanation = explanationResult.response.text();

    // --- Add this delay back here, it's crucial for stability ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before the next API call
    // --- End of delay ---

    const flowchartPrompt = `
You are an expert Mermaid.js diagram generator. Your ONLY task is to output a valid Mermaid.js flowchart.
Based on the concept: "${prompt}", generate a simple flowchart.

CRITICAL INSTRUCTIONS (Follow these absolutely):
1.  **Output Format:** ONLY return the Mermaid diagram code. Do NOT include any extra text, conversational filler, comments (outside Mermaid syntax), or explanations.
2.  **Starting Line:** The very first line MUST be \`flowchart TD\`. Do NOT deviate from this.
3.  **One Statement Per Line:** Each node definition or connection MUST be on its own separate line. Use a newline character (\\n) after every complete statement.
4.  **Node IDs:** Use simple, unique alphanumeric IDs for nodes (e.g., A, B, Step1, Start_Process, End_Point). Do NOT use special characters or spaces in node IDs.
5.  **Node Labels (Text inside shapes):**
    * Node labels (the text displayed inside shapes like [], (), {}, etc.) that contain **any** spaces, parentheses, commas, periods, question marks, or quotes MUST be enclosed in double quotes within the shape.
    * Example: \`A["Start Process"]\`, \`B("Is it True?")\`, \`C{"Decision"}\`.
6.  **Connection Syntax:** Use standard Mermaid connection syntax: \`-->\` (arrow), \`--\` (line), \`-.->\` (dashed arrow).
7.  **Connection Labels (Text on arrows):**
    * Labels on connectors MUST be enclosed in double quotes if they contain **any** spaces or special characters.
    * Example: \`A -- "Yes" --> B\`.
8.  **Conciseness:** Generate a concise flowchart with 5-7 distinct nodes and their connections. Keep it simple and focused.

Example of EXACTLY the output format expected:
\`\`\`mermaid
flowchart TD
  Start[Begin Process] --> Input(Get User Data);
  Input --> Validate{Is Data Valid?};
  Validate -- Yes --> Process(Process Data);
  Validate -- No --> Error[Display Error];
  Process --> Output(Show Result);
  Output --> End[End Process];
  Error --> End;
\`\`\`
`;
    const flowchartResult = await model.generateContent(flowchartPrompt);
    let mermaidCode = flowchartResult.response.text();

    // Clean and extract mermaid code from ```mermaid block
    const mermaidMatch = mermaidCode.match(/```mermaid\s*([\s\S]*?)```/);
    if (mermaidMatch) {
      mermaidCode = mermaidMatch[1].trim();
    } else {
      // Fallback if no block found, remove loose backticks
      mermaidCode = mermaidCode.replace(/```/g, "").trim();
    }

    // --- BEGIN MISTAKE CORRECTION ---
    // Remove any and all 'flowchart TD' or 'graph TD' headers that might be present
    // and then explicitly add a single 'flowchart TD' at the very beginning.
    let lines = mermaidCode.split('\n').map(line => line.trim()); // Trim each line

    // Filter out any lines that are just a header (flowchart TD or graph TD)
    // or start with them, ensuring we only keep actual diagram content.
    let filteredLines = lines.filter(line =>
        !line.toLowerCase().startsWith('flowchart td') &&
        !line.toLowerCase().startsWith('graph td') &&
        line.length > 0 // Also remove purely empty lines
    );

    // Explicitly add the correct header at the very beginning
    mermaidCode = `flowchart TD\n` + filteredLines.join('\n');
    // --- END MISTAKE CORRECTION ---


    // Save to Appwrite
    const res = await database.createDocument(
      'conceptry',
      '68469aa9002608b20bee',
      ID.unique(),
      {
        email,
        head: noteHead,
        content: explanation,
        flowchart: mermaidCode
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error generating note:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}