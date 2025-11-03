import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { QuranService } from '../../services/quran-service';

const quranService = new QuranService();

export const quranTool = createTool({
  id: 'explain-quran-verses',
  description:
    'Fetch and explain Quran verses with Arabic text, English translation, and context',
  inputSchema: z.object({
    reference: z
      .string()
      .describe(
        'Quran verse reference like "2:255", "Surah Al-Baqarah 2:255", or "ayat al-kursi"'
      ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    verses: z
      .array(
        z.object({
          position: z.number(),
          total: z.number(),
          reference: z.string(),
          arabic: z.string(),
          translation: z.string(),
          chapterName: z.string(),
          verseNumber: z.number(),
        })
      )
      .optional(),
    totalVerses: z.number().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      console.log(`Starting verse explanation for: ${context.reference}`);

      // Fetch verses using reference
      console.log(`Fetching verses for reference: ${context.reference}`);
      const verses = await quranService.getVerses(context.reference);

      if (!verses || verses.length === 0) {
        return {
          success: false,
          message: `No verses found for reference: ${context.reference}`,
        };
      }

      // Validate verse limit (1-5 verses for detailed explanation)
      if (verses.length > 5) {
        return {
          success: false,
          message: `Please request 5 or fewer verses at a time for detailed explanations. You requested ${verses.length} verses.`,
        };
      }

      console.log(`Fetched ${verses.length} verses, preparing response...`);

      // Format verses with Arabic, translation, and metadata
      const formattedVerses = verses.map((verse, index) => ({
        position: index + 1,
        total: verses.length,
        reference: `${verse.chapter_name} ${verse.chapter_id}:${verse.verse_number}`,
        arabic: verse.text_uthmani,
        translation: verse.translations[0]?.text || 'Translation not available',
        chapterName: verse.chapter_name,
        verseNumber: verse.verse_number,
      }));

      return {
        success: true,
        verses: formattedVerses,
        totalVerses: verses.length,
        message: `Retrieved ${verses.length} verse${verses.length > 1 ? 's' : ''} from ${formattedVerses[0].chapterName}`,
      };
    } catch (error) {
      console.error('Error in quran tool:', error);
      return {
        success: false,
        message: `Failed to fetch verses: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
