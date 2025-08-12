import { GoogleGenAI, Type } from "@google/genai";
import { type IterativeReductionPlan, CompressionProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        quality_floor_info: {
            type: Type.STRING,
            description: "A brief, conceptual explanation of the quality limit considered (e.g., 'SSIM 0.85 to prevent major degradation')."
        },
        planning_summary: {
            type: Type.OBJECT,
            properties: {
                fileType: { type: Type.STRING, description: "The detected file type (e.g., 'Gambar JPEG', 'Gambar PNG')." },
                complexity: { type: Type.STRING, enum: ['Sederhana', 'Sedang', 'Kompleks'] },
                visualFocus: { type: Type.STRING, enum: ['Terdeteksi', 'Tidak Terdeteksi'] },
                textureProfile: { type: Type.STRING, enum: ['Halus', 'Kasar', 'Campuran'] }
            },
            required: ["fileType", "complexity", "visualFocus", "textureProfile"]
        },
        cascade: {
            type: Type.ARRAY,
            description: "A ladder of compression strategies to try in order, from gentlest to most aggressive.",
            items: {
                type: Type.OBJECT,
                properties: {
                    strategy_name: { type: Type.STRING, description: "A descriptive name for the strategy, e.g., 'Smart Format Conversion (AVIF)'." },
                    tool: { type: Type.STRING, description: "The conceptual tool for this strategy." },
                    parameters: {
                        type: Type.OBJECT,
                        description: "Parameters for the tool. Use only what's necessary for the strategy.",
                        properties: {
                            format: { type: Type.STRING, enum: ['jpeg', 'webp', 'avif'], description: "Target format, if converting." },
                            quality: { type: Type.NUMBER, description: "Compression quality (0.0 to 1.0)." },
                            resolution_scale: { type: Type.NUMBER, description: "Factor to scale resolution by (e.g., 0.9 for 90%). Only use if necessary." }
                        },
                    },
                    rationale: { type: Type.STRING, description: "Why this strategy is being attempted at this stage of the cascade." }
                },
                required: ["strategy_name", "tool", "parameters", "rationale"]
            }
        }
    },
    required: ["quality_floor_info", "planning_summary", "cascade"]
};

const getMockPlan = (fileName: string, profile: CompressionProfile): Promise<IterativeReductionPlan> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const mockData: IterativeReductionPlan = {
                quality_floor_info: 'Target SSIM > 0.85, to avoid visible artifacts.',
                planning_summary: {
                    fileType: 'Gambar PNG',
                    complexity: 'Kompleks',
                    visualFocus: 'Terdeteksi',
                    textureProfile: 'Campuran'
                },
                cascade: [
                    { strategy_name: 'Optimasi Format Asli (PNG)', tool: 'oxipng', parameters: {}, rationale: 'First attempt: lossless compression to maintain max quality.'},
                    { strategy_name: 'Konversi Format Cerdas (AVIF)', tool: 'AVIFenc', parameters: { format: 'avif', quality: 0.8 }, rationale: 'Next-gen format AVIF for superior compression at high visual quality.'},
                    { strategy_name: 'Reduksi Kualitas Agresif (JPG)', tool: 'cjpeg', parameters: { format: 'jpeg', quality: 0.65 }, rationale: 'If others fail, trade transparency for size by converting to JPG with aggressive quality reduction.'},
                    { strategy_name: 'Reduksi Resolusi (90%)', tool: 'ImageMagick', parameters: { format: 'jpeg', quality: 0.7, resolution_scale: 0.9 }, rationale: 'Final attempt: slightly reduce resolution to guarantee size reduction.'},
                ]
            };
            resolve(mockData);
        }, 1500);
    });
};

export const getIterativeReductionPlan = async (fileName: string, profile: CompressionProfile): Promise<IterativeReductionPlan> => {
    if (!ai) {
        return getMockPlan(fileName, profile);
    }
    
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `As an AI Compression Strategist, create an "Iterative Reduction Cascade (IRC)" plan for a file named "${fileName}". The user has selected the "${profile}" profile, which is your highest priority. Your goal is to FORCE a file size reduction.

Generate a JSON object representing a **ladder of strategies**. The system will try each one in order and stop at the first success.

The plan must include:
1.  **quality_floor_info**: A conceptual quality limit you're respecting (e.g., "SSIM > 0.85").
2.  **planning_summary**: A brief analysis of the file based on its name.
3.  **cascade**: An array of strategies, from gentlest to most aggressive. Each strategy must have:
    *   **strategy_name**: A descriptive name (e.g., "In-Place Optimization", "Aggressive JPG Conversion").
    *   **tool**: A plausible conceptual tool name (e.g., 'oxipng', 'AVIFenc', 'ImageMagick').
    *   **parameters**: An object with ONLY the necessary keys for that strategy. Can include 'format', 'quality' (0.0-1.0), or 'resolution_scale' (e.g., 0.9 for 90%). For lossless, use an empty object: {}.
    *   **rationale**: Your technical justification for this attempt.

**Profile Guidance:**
- **'${CompressionProfile.ARCHIVE}'**: Gentle cascade. Prioritize quality. Maybe 1-2 steps.
- **'${CompressionProfile.BALANCED}'**: Moderate cascade. Good balance of format conversion and quality reduction. 2-3 steps.
- **'${CompressionProfile.SUPER_SMALL}'**: Aggressive cascade. Use everything: format conversion, low quality, and finally 'resolution_scale' as a last resort. 3-5 steps.

The cascade should be logical. Don't jump to resolution scaling immediately. Try quality/format changes first.`,
            config: {
                systemInstruction: "You are 'Agentika', an expert AI that designs a multi-step, iterative compression plan to forcefully reduce file size. You do not execute the compression, you only create the plan as a JSON object based on the provided schema. The user's selected profile is the most important constraint.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = result.text;
        const parsedResult = JSON.parse(jsonString);
        
        if (parsedResult && parsedResult.cascade && parsedResult.cascade.length > 0) {
            return parsedResult as IterativeReductionPlan;
        } else {
            throw new Error("Invalid or empty cascade plan from API");
        }

    } catch (error) {
        console.error("Error fetching compression plan from Gemini:", error);
        throw new Error("Failed to get analysis from AI. Please try again.");
    }
};
