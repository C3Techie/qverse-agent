import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { QuranService } from '../../services/quran-service';

const quranService = new QuranService();

const verseSchema = z.object({
  reference: z.string(),
  arabic: z.string(),
  translation: z.string(),
  chapterName: z.string(),
  verseNumber: z.number(),
});

const fetchVerses = createStep({
  id: 'fetch-verses',
  description: 'Fetches Quran verses for a given reference',
  inputSchema: z.object({
    reference: z
      .string()
      .describe(
        'The Quran reference to get verses for (e.g., "2:255", "ayat al-kursi")'
      ),
  }),
  outputSchema: z.object({
    verses: z.array(verseSchema),
    totalVerses: z.number(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const verses = await quranService.getVerses(inputData.reference);

    if (!verses || verses.length === 0) {
      throw new Error(`No verses found for reference: ${inputData.reference}`);
    }

    const formattedVerses = verses.map((verse) => ({
      reference: `${verse.chapter_name} ${verse.chapter_id}:${verse.verse_number}`,
      arabic: verse.text_uthmani,
      translation: verse.translations[0]?.text || 'Translation not available',
      chapterName: verse.chapter_name,
      verseNumber: verse.verse_number,
    }));

    return {
      verses: formattedVerses,
      totalVerses: verses.length,
    };
  },
});

const generateExplanation = createStep({
  id: 'generate-explanation',
  description: 'Generates a comprehensive explanation for the verses',
  inputSchema: z.object({
    verses: z.array(verseSchema),
    totalVerses: z.number(),
  }),
  outputSchema: z.object({
    explanation: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const { verses, totalVerses } = inputData;

    let explanation = `# Quran Verse${totalVerses > 1 ? 's' : ''} Explanation\n\n`;

    verses.forEach((verse, index) => {
      explanation += `## ${index + 1}. ${verse.reference}\n\n`;
      explanation += `**Arabic Text:**\n${verse.arabic}\n\n`;
      explanation += `**English Translation:**\n${verse.translation}\n\n`;
      explanation += `---\n\n`;
    });

    explanation += `*Retrieved ${totalVerses} verse${totalVerses > 1 ? 's' : ''} from ${verses[0].chapterName}*`;

    return {
      explanation,
    };
  },
});

const qverseWorkflow = createWorkflow({
  id: 'qverse-workflow',
  inputSchema: z.object({
    reference: z.string().describe('The Quran reference to get verses for'),
  }),
  outputSchema: z.object({
    explanation: z.string(),
  }),
})
  .then(fetchVerses)
  .then(generateExplanation);

qverseWorkflow.commit();

export { qverseWorkflow };
