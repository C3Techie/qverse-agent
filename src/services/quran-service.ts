interface QuranVerse {
  id: number;
  verse_number: number;
  chapter_id: number;
  verse_key: string;
  text_uthmani: string;
  translations: Array<{
    text: string;
    resource_name?: string;
  }>;
}

interface QuranApiResponse {
  verses: QuranVerse[];
}

interface ChapterInfo {
  chapter: {
    id: number;
    name_simple: string;
    name_arabic: string;
  };
}

interface ParsedReference {
  chapter: number;
  fromVerse: number;
  toVerse: number;
}

export class QuranService {
  private baseUrl = 'https://api.quran.com/api/v4';
  private specialVerses: Record<string, string> = {
    'ayat al-kursi': '2:255',
    'al kursi': '2:255',
    'throne verse': '2:255',
    'surah yasin': '36:1',
    'yaseen': '36:1',
    'surah kahf': '18:1',
    'al kahf': '18:1',
    'surah fatihah': '1:1',
    'al fatihah': '1:1',
    'the opening': '1:1',
  };

  private surahMap: Record<string, number> = {
    'al-fatihah': 1,
    fatihah: 1,
    'the opening': 1,
    'al-baqarah': 2,
    baqarah: 2,
    'the cow': 2,
    'ali imran': 3,
    imran: 3,
    'family of imran': 3,
    'an-nisa': 4,
    nisa: 4,
    women: 4,
    'al-maidah': 5,
    maidah: 5,
    'the table': 5,
    'al-anam': 6,
    anam: 6,
    'the cattle': 6,
    'al-araf': 7,
    araf: 7,
    'the heights': 7,
    'al-anfal': 8,
    anfal: 8,
    'the spoils of war': 8,
    'at-tawbah': 9,
    tawbah: 9,
    'the repentance': 9,
    yunus: 10,
    yasin: 36,
    'ya-sin': 36,
    'al-kahf': 18,
    kahf: 18,
    'the cave': 18,
    'ar-rahman': 55,
    rahman: 55,
    'the beneficent': 55,
    'al-mulk': 67,
    mulk: 67,
    'the sovereignty': 67,
  };

  async getVerses(reference: string) {
    try {
      console.log(`Fetching verses for reference: ${reference}`);

      const parsed = this.parseReference(reference);
      if (!parsed) {
        throw new Error(`Invalid Quran reference: ${reference}`);
      }

      const { chapter, fromVerse, toVerse } = parsed;

      // Validate verse count (1-5 verses)
      const verseCount = toVerse - fromVerse + 1;
      if (verseCount < 1 || verseCount > 5) {
        throw new Error('Please request between 1 and 5 verses only.');
      }

      console.log(
        `Fetching chapter ${chapter}, verses ${fromVerse} to ${toVerse}`
      );

      // Fetch verses from Quran API with multiple translations
      const response = await fetch(
        `${this.baseUrl}/verses/by_chapter/${chapter}?from=${fromVerse}&to=${toVerse}&words=false&translations=21,20,19,131,85&fields=text_uthmani,chapter_id`
      );

      if (!response.ok) {
        throw new Error(`Quran API error: ${response.status}`);
      }

      const data = (await response.json()) as QuranApiResponse;

      if (!data.verses || data.verses.length === 0) {
        throw new Error('No verses found for the provided reference.');
      }

      // Fetch chapter names
      const chapterResponse = await fetch(
        `${this.baseUrl}/chapters/${chapter}?language=en`
      );

      if (!chapterResponse.ok) {
        throw new Error(
          `Failed to fetch chapter info: ${chapterResponse.status}`
        );
      }

      const chapterData = (await chapterResponse.json()) as ChapterInfo;

      return data.verses.map((verse, index) => {
        // Ensure we have translations
        let translations = verse.translations || [];

        // If no translations, provide a fallback
        if (translations.length === 0) {
          translations = [
            {
              text: 'Translation loading...',
            },
          ];
        }

        return {
          id: verse.id,
          verse_number: verse.verse_number,
          chapter_id: verse.chapter_id,
          verse_key: verse.verse_key,
          text_uthmani: verse.text_uthmani,
          translations: translations,
          chapter_name: chapterData.chapter.name_simple,
          chapter_name_arabic: chapterData.chapter.name_arabic,
          position: index + 1,
          total: data.verses.length,
        };
      });
    } catch (error) {
      console.error('Quran service error:', error);
      throw new Error(
        `Failed to fetch Quran verses: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  parseReference(reference: string): ParsedReference | null {
    if (!reference || typeof reference !== 'string') {
      return null;
    }

    reference = reference.toLowerCase().trim();

    // Handle special verse names
    if (this.specialVerses[reference]) {
      reference = this.specialVerses[reference];
    }

    // Parse chapter:verse format (e.g., "2:255", "2:255-257")
    const match = reference.match(/(\d+):(\d+)(?:-(\d+))?/);
    if (match) {
      const chapter = parseInt(match[1]);
      const fromVerse = parseInt(match[2]);
      const toVerse = match[3] ? parseInt(match[3]) : fromVerse;

      // Validate chapter and verse numbers
      if (
        chapter >= 1 &&
        chapter <= 114 &&
        fromVerse >= 1 &&
        toVerse >= fromVerse
      ) {
        return { chapter, fromVerse, toVerse };
      }
    }

    // Try to parse by surah name (e.g., "surah al-baqarah 2:255")
    const surahMatch = reference.match(
      /(?:surah\s+)?([a-z\s]+)\s*(\d+):?(\d+)?/i
    );
    if (surahMatch) {
      const surahName = surahMatch[1].trim().toLowerCase();
      const chapter = this.surahNameToNumber(surahName);
      if (chapter) {
        const fromVerse = surahMatch[3] ? parseInt(surahMatch[3]) : 1;
        const toVerse = fromVerse;
        return { chapter, fromVerse, toVerse };
      }
    }

    return null;
  }

  surahNameToNumber(name: string): number | null {
    return this.surahMap[name] || null;
  }

  validateReference(reference: string): boolean {
    return this.parseReference(reference) !== null;
  }

  validateVerseCount(fromVerse: number, toVerse: number): boolean {
    const count = toVerse - fromVerse + 1;
    return count >= 1 && count <= 5;
  }
}
