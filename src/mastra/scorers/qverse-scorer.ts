import { z } from 'zod';
import { createToolCallAccuracyScorerCode } from '@mastra/evals/scorers/code';
import { createCompletenessScorer } from '@mastra/evals/scorers/code';
import { createScorer } from '@mastra/core/scores';

export const toolCallAppropriatenessScorer = createToolCallAccuracyScorerCode({
  expectedTool: 'quranTool',
  strictMode: false,
});

export const completenessScorer = createCompletenessScorer();

// Custom LLM-judged scorer: evaluates if Quran verse explanations are respectful and comprehensive
export const respectfulnessScorer = createScorer({
  name: 'Respectfulness Quality',
  description:
    'Checks that Quran verse explanations are respectful, reverent, and comprehensive',
  type: 'agent',
  judge: {
    model: 'google/gemini-2.0-flash-exp',
    instructions:
      'You are an expert evaluator of Islamic content quality and respectfulness. ' +
      'Determine whether the assistant provides respectful, accurate, and comprehensive explanations of Quran verses. ' +
      'Check for: 1) Respectful tone, 2) Accurate verse reference, 3) Comprehensive explanation, 4) Appropriate context. ' +
      'Return only the structured JSON matching the provided schema.',
  },
})
  .preprocess(({ run }) => {
    const userText = (run.input?.inputMessages?.[0]?.content as string) || '';
    const assistantText = (run.output?.[0]?.content as string) || '';
    return { userText, assistantText };
  })
  .analyze({
    description:
      'Extract verse references and evaluate explanation quality and respectfulness',
    outputSchema: z.object({
      respectful: z.boolean(),
      comprehensive: z.boolean(),
      confidence: z.number().min(0).max(1).default(1),
      explanation: z.string().default(''),
    }),
    createPrompt: ({ results }) => `
            You are evaluating if a Quran verse explanation agent correctly handled a user request with respect and comprehensiveness.
            User text:
            """
            ${results.preprocessStepResult.userText}
            """
            Assistant response:
            """
            ${results.preprocessStepResult.assistantText}
            """
            Tasks:
            1) Identify if the assistant's response is respectful and reverent when discussing Quranic verses.
            2) Check if the explanation is comprehensive (includes context, themes, lessons).
            3) Verify that the verse reference is accurate and properly formatted.
            Return JSON with fields:
            {
            "respectful": boolean,
            "comprehensive": boolean,
            "confidence": number, // 0-1
            "explanation": string
            }
        `,
  })
  .generateScore(({ results }) => {
    const r = (results as any)?.analyzeStepResult || {};
    if (!r.respectful) return 0; // Must be respectful
    if (r.comprehensive)
      return Math.max(0, Math.min(1, 0.7 + 0.3 * (r.confidence ?? 1)));
    return 0.5; // Respectful but not comprehensive
  })
  .generateReason(({ results, score }) => {
    const r = (results as any)?.analyzeStepResult || {};
    return `Respectfulness scoring: respectful=${r.respectful ?? false}, comprehensive=${r.comprehensive ?? false}, confidence=${r.confidence ?? 0}. Score=${score}. ${r.explanation ?? ''}`;
  });

export const scorers = {
  toolCallAppropriatenessScorer,
  completenessScorer,
  respectfulnessScorer,
};
