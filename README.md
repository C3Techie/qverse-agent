# QVerse - Quran Verse Explanation Agent

An AI agent that provides clear, insightful explanations of Quran verses with Arabic text, English translation, transliteration, and comprehensive context. Built with Mastra AI Framework and integrated with Telex via Mastra A2A protocol.

## ✨ Features

- 🕌 **Detailed Verse Explanations** - Comprehensive insights with historical context and themes
- 📖 **Bilingual Display** - Arabic text (Uthmani script) with English translation
- 🧠 **AI-Powered Analysis** - Google Gemini 2.0-flash-exp for intelligent explanations
- ⚡ **Mastra Framework** - Built on Mastra's agent framework with workflows and scoring
- ✅ **Smart Validation** - 1-5 verse limit with intelligent parsing
- 📊 **Quality Scoring** - Built-in scorers for tool accuracy, completeness, and respectfulness
- 🤖 **A2A Protocol** - Full Mastra Agent-to-Agent compliance
- 🆓 **100% Free** - All services use free tiers

## 🏗️ Architecture


**Tech Stack:**
- **Framework**: Mastra AI Agent Framework v0.23+
- **LLM Provider**: Google Gemini 2.0-flash-exp
- **Quran Data**: Quran.com API (no auth required)
- **Database**: LibSQL (local file storage)
- **Language**: TypeScript
- **Package Manager**: npm

**Project Structure:**
```
qverse-agent/
├── src/
│   ├── mastra/
│   │   ├── agents/
│   │   │   └── qverse-agent.ts      # Main agent configuration
│   │   ├── tools/
│   │   │   └── quran-tool.ts        # Quran verse fetching tool
│   │   ├── workflows/
│   │   │   └── qverse-workflow.ts   # Verse explanation workflow
│   │   ├── scorers/
│   │   │   └── qverse-scorer.ts     # Quality evaluation scorers
│   │   ├── routes/
│   │   │   └── a2a-agent-route.ts    # A2A protocol route handler
│   │   └── index.ts                 # Mastra instance
│   └── services/
│       └── quran-service.ts         # Quran.com API client
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 20.9.0
- npm or yarn
- Google AI API key (free tier available)

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd qverse-agent
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```bash
# Required
GOOGLE_API_KEY=your_google_api_key_here

# Optional (for development)
PORT=4111
DATABASE_URL=file:./qverse.db
MASTRA_LOG_LEVEL=info
```

**Get your API key:**
- **Google AI**: https://aistudio.google.com/apikey (free tier available)

### 4. Run Development Server
```bash
npm run dev
```

The Mastra development server will start with:
- Agent playground UI
- Workflow debugger
- Scoring dashboard

### 5. Build for Production
```bash
npm run build
npm start
```

## 📖 Usage

### Via Mastra Playground
1. Run `npm run dev`
2. Open the Mastra playground UI (usually at http://localhost:4111)
3. Select the "QVerse Agent"
4. Ask natural language questions:
   - "Explain ayat al-kursi"
   - "What does Surah Al-Fatihah 1:1 mean?"
   - "Tell me about verses 2:255-257"

### Via Telex Workflow
1. Deploy the agent to Mastra Cloud (see deployment section)
2. Add the QVerse agent to your Telex workflow
3. Use the A2A endpoint: `https://your-deployment.mastra.cloud/api/agents/qverseAgent`

### Via API Call (A2A Protocol)

```bash
curl -X POST http://localhost:4111/api/agents/qverseAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "role": "user",
      "content": "Explain ayat al-kursi"
    }]
  }'
```

### Via Workflow Execution

```bash
curl -X POST http://localhost:4111/api/workflows/qverse-workflow/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "2:255"
  }'
```

## 🎯 Supported Verse Formats

The agent understands multiple input formats:

| Format | Example | Description |
|--------|---------|-------------|
| Chapter:Verse | `2:255` | Single verse |
| Chapter:Verse-Range | `1:1-7` | Multiple verses (max 5) |
| Named Surah | `Surah Al-Fatihah 1:1` | Surah name + reference |
| Famous Verses | `ayat al-kursi` | Well-known verse names |
| Natural Language | `Show me the throne verse` | Conversational input |

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests (if configured)
npm test
```

### Project Components

#### Agent (`src/mastra/agents/qverse-agent.ts`)
- Main AI agent configuration
- Instructions and behavior definition
- Tool integration
- Memory and scoring setup

#### Tool (`src/mastra/tools/quran-tool.ts`)
- Fetches verses from Quran.com API
- Validates verse references
- Formats Arabic text and translations
- Returns structured verse data

#### Workflow (`src/mastra/workflows/qverse-workflow.ts`)
- Multi-step verse processing pipeline
- Fetches verses → Generates explanation
- Structured data flow
- Error handling

#### Scorers (`src/mastra/scorers/qverse-scorer.ts`)
- **Tool Call Appropriateness**: Validates correct tool usage
- **Completeness**: Checks response thoroughness
- **Respectfulness**: Ensures reverent tone for Quranic content

#### Service (`src/services/quran-service.ts`)
- Quran.com API integration
- Reference parsing and validation
- Surah name mapping
- Special verse handling (e.g., "ayat al-kursi")

### Adding New Features

1. **New Tool**: Create in `src/mastra/tools/`
2. **New Scorer**: Add to `src/mastra/scorers/qverse-scorer.ts`
3. **Update Agent**: Modify `src/mastra/agents/qverse-agent.ts`
4. **Register**: Update `src/mastra/index.ts`

## 🚢 Deployment to Mastra Cloud

### Prerequisites
- Mastra CLI installed: `npm install -g mastra`
- Mastra Cloud account

### Deploy Steps

1. **Login to Mastra Cloud**
```bash
mastra login
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
mastra deploy
```

4. **Set environment variables** in Mastra Cloud dashboard:
```
GOOGLE_API_KEY=your_key_here
DATABASE_URL=file:./qverse.db
```

5. **Test the deployment**
```bash
curl https://your-app.mastra.cloud/api/agents/qverseAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Explain ayat al-kursi"}]}'
```

### Mastra Cloud Features
- ✅ Automatic scaling
- ✅ Built-in observability
- ✅ Workflow debugging
- ✅ Score tracking
- ✅ A2A protocol support

## 🆓 Free Services & Limits

| Service | Free Tier | Used For |
|---------|-----------|----------|
| **Quran.com API** | Unlimited | Verse data |
| **Google Gemini** | 10 req/min, 1,500 req/day (2.0-flash-exp) | LLM explanations |
| **Mastra Cloud** | Generous free tier | Agent hosting |

## 📊 Scoring System

The agent includes three built-in scorers:

### 1. Tool Call Appropriateness
- Validates that the agent calls the correct tool (quranTool)
- Checks for proper tool input format
- Score: 0-1 (1 = perfect tool usage)

### 2. Completeness
- Evaluates if the response includes all requested information
- Checks for Arabic text, translation, and explanation
- Score: 0-1 (1 = complete response)

### 3. Respectfulness
- LLM-judged scorer for Islamic content quality
- Ensures respectful tone when discussing Quran
- Validates comprehensive explanations
- Score: 0-1 (1 = highly respectful and comprehensive)

View scores in the Mastra dashboard during development.

## 🐛 Troubleshooting

### Issue: "Failed to resolve model configuration"
**Solution**: Ensure `GOOGLE_API_KEY` is set correctly in `.env` or environment variables.

### Issue: Agent not responding
**Solution**: 
1. Check that Mastra dev server is running (`npm run dev`)
2. Verify the agent name matches: `qverseAgent`
3. Check logs for any errors

### Issue: TypeScript compilation errors
**Solution**: 
```bash
npm install
npm run build
```

### Issue: Quran API timeout
**Solution**: The Quran.com API is free and public. Check your internet connection or try again later.

## 🧪 Testing

### Manual Testing with Mastra Playground
1. Run `npm run dev`
2. Open the playground UI
3. Test with various verse references

### Example Test Cases
```typescript
// Single verse
"Explain 2:255"

// Multiple verses
"Tell me about verses 1:1-7"

// Famous verse
"Explain ayat al-kursi"

// Surah name
"What is Surah Al-Fatihah about?"

// Edge cases
"Show me 10 verses" // Should explain 5-verse limit
"Explain verse 999:999" // Should handle invalid references
```

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🙏 Acknowledgments

- **Quran.com API** for comprehensive verse data
- **Mastra Framework** for powerful agent infrastructure
- **Google Gemini** for intelligent AI analysis
- **HNG Internship** for the opportunity
- Open source community for support

## 📚 Additional Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [Quran.com API Docs](https://api-docs.quran.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Mastra A2A Protocol](https://mastra.ai/docs/a2a)

---

**Built with ❤️ by C3Techie for the HNG Internship**

## ✅ Complete Implementation Features

- ✅ **TypeScript implementation** - Full type safety
- ✅ **1-5 verse limit with validation** - Detailed explanations
- ✅ **AI-powered explanations** - Google Gemini 2.5 Pro
- ✅ **Mastra framework integration** - Agents, tools, workflows, scorers
- ✅ **Complete error handling** - Robust and reliable
- ✅ **Free external APIs** - Quran.com + Google AI
- ✅ **Workflow support** - Multi-step processing
- ✅ **Quality scoring** - Built-in evaluation
- ✅ **Cloud-deployable** - Works seamlessly on Mastra Cloud
- ✅ **A2A protocol ready** - Telex integration compatible

This is a complete, production-ready QVerse implementation following the Mastra weather-agent pattern! 🎉
