
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { qverseWorkflow } from './workflows/qverse-workflow';
import { qverseAgent } from './agents/qverse-agent';
import {
  toolCallAppropriatenessScorer,
  completenessScorer,
  respectfulnessScorer,
} from './scorers/qverse-scorer';
import { a2aAgentRoute } from './routes/a2a-agent-route';

export const mastra = new Mastra({
  workflows: { qverseWorkflow },
  agents: { qverseAgent },
  scorers: {
    toolCallAppropriatenessScorer,
    completenessScorer,
    respectfulnessScorer,
  },
  server: {
    apiRoutes: [
      // A2A Protocol Route - Primary integration endpoint for Telex
      a2aAgentRoute,
    ],
  },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'QVerse',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
