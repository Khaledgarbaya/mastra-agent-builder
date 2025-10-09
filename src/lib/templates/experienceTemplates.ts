import type { Template } from './templateTypes';
import type { SchemaField } from '../../types/workflow';

// Helper function to convert simple schema to SchemaField format
function createSchemaField(name: string, type: string, required: boolean): SchemaField {
  return {
    id: `${name}-${type}`,
    name,
    type: type as any,
    optional: !required,
  };
}

export const customerSupportSystemTemplate: Template = {
  id: 'customer-support-system',
  name: 'Customer Support System',
  description: 'Complete customer support system with agent, knowledge base tool, and escalation workflow.',
  icon: '🎧',
  category: 'complete',
  tags: ['customer-support', 'agent', 'escalation', 'knowledge-base'],
  project: {
    id: 'customer-support-system-project',
    name: 'Customer Support System',
    settings: {
      projectName: 'Customer Support System',
      description: 'Complete customer support automation system',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: true },
      environmentVariables: {
        OPENAI_API_KEY: '',
        KNOWLEDGE_BASE_URL: '',
      },
    },
    nodes: [
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 200, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'customerSupportAgent',
            name: 'Customer Support Agent',
            description: 'AI agent for handling customer inquiries and support requests',
            tools: ['knowledgeBaseTool', 'escalationTool'],
            workflows: ['supportWorkflow'],
            agents: [],
            instructions: `You are a professional customer support agent. Your role is to:

1. Greet customers warmly and understand their issue
2. Search the knowledge base for relevant solutions
3. Provide clear, helpful responses
4. Escalate complex issues to human agents when needed
5. Maintain a friendly and professional tone

Always prioritize customer satisfaction and provide accurate information.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 20 },
            maxRetries: 3,
          },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 200 },
        data: {
          type: 'tool',
          config: {
            id: 'knowledgeBaseTool',
            description: 'Search internal knowledge base for customer support information',
            inputSchema: [createSchemaField('query', 'string', true), createSchemaField('category', 'string', false)],
            outputSchema: [createSchemaField('results', 'array', true), createSchemaField('total', 'number', true)],
            executeCode: `async ({ query, category }) => {
  try {
    const response = await fetch(\`\${process.env.KNOWLEDGE_BASE_URL}/search\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category }),
    });
    
    const data = await response.json();
    return {
      results: data.results || [],
      total: data.total || 0,
    };
  } catch (error) {
    return {
      results: [],
      total: 0,
    };
  }
}`,
          },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 600, y: 200 },
        data: {
          type: 'tool',
          config: {
            id: 'escalationTool',
            description: 'Escalate complex issues to human support agents',
            inputSchema: [
              createSchemaField('issue', 'string', true),
              createSchemaField('customerId', 'string', true),
              createSchemaField('priority', 'string', false),
            ],
            outputSchema: [
              createSchemaField('ticketId', 'string', true),
              createSchemaField('assignedAgent', 'string', true),
            ],
            executeCode: `async ({ issue, customerId, priority = 'medium' }) => {
  // Mock escalation system
  const ticketId = \`TKT-\${Date.now()}\`;
  const assignedAgent = \`Agent-\${Math.floor(Math.random() * 10) + 1}\`;
  
  return {
    ticketId,
    assignedAgent,
  };
}`,
          },
        },
      },
      {
        id: 'step-1',
        type: 'step',
        position: { x: 400, y: 400 },
        data: {
          type: 'step',
          config: {
            id: 'supportWorkflow',
            description: 'Main customer support workflow',
            inputSchema: [
              createSchemaField('customerMessage', 'string', true),
              createSchemaField('customerId', 'string', true),
            ],
            outputSchema: [
              createSchemaField('response', 'string', true),
              createSchemaField('escalated', 'boolean', true),
            ],
            executeCode: `async ({ customerMessage, customerId }) => {
  // This would integrate with the customer support agent
  // For now, return a mock response
  return {
    response: 'Thank you for contacting support. We are here to help!',
    escalated: false,
  };
}`,
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'agent-1', target: 'tool-1', type: 'default' },
      { id: 'e2', source: 'agent-1', target: 'tool-2', type: 'default' },
      { id: 'e3', source: 'step-1', target: 'agent-1', type: 'default' },
    ],
  },
};

export const contentCreationPipelineTemplate: Template = {
  id: 'content-creation-pipeline',
  name: 'Content Creation Pipeline',
  description: 'Automated content creation system with research, writing, and review agents.',
  icon: '✍️',
  category: 'complete',
  tags: ['content', 'writing', 'research', 'automation'],
  project: {
    id: 'content-creation-pipeline-project',
    name: 'Content Creation Pipeline',
    settings: {
      projectName: 'Content Creation Pipeline',
      description: 'Automated content creation and management system',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: true },
      environmentVariables: {
        OPENAI_API_KEY: '',
        CONTENT_API_URL: '',
      },
    },
    nodes: [
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'researchAgent',
            name: 'Research Agent',
            description: 'Agent specialized in researching topics and gathering information',
            tools: ['webSearchTool', 'contentAnalysisTool'],
            workflows: ['researchWorkflow'],
            agents: [],
            instructions: `You are a research specialist. Your role is to:

1. Understand the research requirements and topic
2. Gather relevant information from multiple sources
3. Analyze and synthesize the research findings
4. Provide comprehensive research reports
5. Identify key insights and data points

Focus on accuracy, relevance, and depth of research.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 15 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 400, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'contentWriterAgent',
            name: 'Content Writer Agent',
            description: 'Agent specialized in creating high-quality written content',
            tools: ['contentAnalysisTool', 'grammarTool'],
            workflows: ['writingWorkflow'],
            agents: [],
            instructions: `You are a professional content writer. Your role is to:

1. Create engaging and informative content
2. Adapt writing style to target audience
3. Ensure proper grammar and structure
4. Incorporate research findings effectively
5. Maintain consistent tone and voice

Focus on clarity, engagement, and value delivery.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 20 },
            maxRetries: 3,
          },
        },
      },
      {
        id: 'agent-3',
        type: 'agent',
        position: { x: 700, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'reviewAgent',
            name: 'Review Agent',
            description: 'Agent specialized in reviewing and editing content',
            tools: ['grammarTool', 'contentAnalysisTool'],
            workflows: ['reviewWorkflow'],
            agents: [],
            instructions: `You are a content reviewer and editor. Your role is to:

1. Review content for quality and accuracy
2. Check grammar, spelling, and style
3. Ensure content meets requirements
4. Provide constructive feedback
5. Approve or request revisions

Focus on quality assurance and content optimization.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 10 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 100, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'webSearchTool',
            description: 'Search the web for relevant information',
            inputSchema: [createSchemaField('query', 'string', true), createSchemaField('limit', 'number', false)],
            outputSchema: [createSchemaField('results', 'array', true), createSchemaField('total', 'number', true)],
            executeCode: `async ({ query, limit = 10 }) => {
  // Mock web search implementation
  return {
    results: [
      {
        title: 'Sample search result',
        url: 'https://example.com',
        snippet: 'This is a sample search result snippet...',
      },
    ],
    total: 1,
  };
}`,
          },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 400, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'contentAnalysisTool',
            description: 'Analyze content for quality, readability, and SEO',
            inputSchema: [createSchemaField('content', 'string', true), createSchemaField('type', 'string', false)],
            outputSchema: [
              createSchemaField('readability', 'number', true),
              createSchemaField('wordCount', 'number', true),
              createSchemaField('suggestions', 'array', true),
            ],
            executeCode: `async ({ content, type = 'general' }) => {
  const wordCount = content.split(' ').length;
  const readability = Math.max(1, Math.min(100, 100 - (wordCount / 10)));
  
  return {
    readability,
    wordCount,
    suggestions: [
      'Consider adding more examples',
      'Check for passive voice usage',
      'Ensure proper paragraph breaks',
    ],
  };
}`,
          },
        },
      },
      {
        id: 'tool-3',
        type: 'tool',
        position: { x: 700, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'grammarTool',
            description: 'Check grammar, spelling, and style',
            inputSchema: [createSchemaField('text', 'string', true)],
            outputSchema: [createSchemaField('errors', 'array', true), createSchemaField('suggestions', 'array', true)],
            executeCode: `async ({ text }) => {
  // Mock grammar checking
  return {
    errors: [],
    suggestions: [
      'Consider using more active voice',
      'Check for consistent tense usage',
    ],
  };
}`,
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'agent-1', target: 'tool-1', type: 'default' },
      { id: 'e2', source: 'agent-1', target: 'tool-2', type: 'default' },
      { id: 'e3', source: 'agent-2', target: 'tool-2', type: 'default' },
      { id: 'e4', source: 'agent-2', target: 'tool-3', type: 'default' },
      { id: 'e5', source: 'agent-3', target: 'tool-3', type: 'default' },
      { id: 'e6', source: 'agent-1', target: 'agent-2', type: 'default' },
      { id: 'e7', source: 'agent-2', target: 'agent-3', type: 'default' },
    ],
  },
};

export const dataAnalysisWorkflowTemplate: Template = {
  id: 'data-analysis-workflow',
  name: 'Data Analysis Workflow',
  description: 'Complete data analysis pipeline with data loading, processing, analysis, and reporting.',
  icon: '📊',
  category: 'complete',
  tags: ['data', 'analysis', 'processing', 'reporting'],
  project: {
    id: 'data-analysis-workflow-project',
    name: 'Data Analysis Workflow',
    settings: {
      projectName: 'Data Analysis Workflow',
      description: 'Comprehensive data analysis and reporting system',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: true },
      environmentVariables: {
        DATABASE_URL: '',
        ANALYTICS_API_KEY: '',
      },
    },
    nodes: [
      {
        id: 'step-1',
        type: 'step',
        position: { x: 100, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataLoader',
            description: 'Load data from various sources',
            inputSchema: [
              createSchemaField('source', 'string', true),
              { name: 'query', type: 'string', required: false },
            ],
            outputSchema: [
              { name: 'data', type: 'array', required: true },
              { name: 'metadata', type: 'object', required: true },
            ],
            executeCode: `async ({ source, query }) => {
  // Mock data loading
  const mockData = [
    { id: 1, value: 100, category: 'A' },
    { id: 2, value: 200, category: 'B' },
    { id: 3, value: 150, category: 'A' },
  ];
  
  return {
    data: mockData,
    metadata: {
      source,
      count: mockData.length,
      loadedAt: new Date().toISOString(),
    },
  };
}`,
          },
        },
      },
      {
        id: 'step-2',
        type: 'step',
        position: { x: 400, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataProcessor',
            description: 'Clean and process the loaded data',
            inputSchema: [
              { name: 'data', type: 'array', required: true },
              createSchemaField('filters', 'object', false),
            ],
            outputSchema: [
              createSchemaField('processedData', 'array', true),
              createSchemaField('stats', 'object', true),
            ],
            executeCode: `async ({ data, filters }) => {
  // Mock data processing
  const processedData = data.filter(item => item.value > 0);
  const stats = {
    originalCount: data.length,
    processedCount: processedData.length,
    avgValue: processedData.reduce((sum, item) => sum + item.value, 0) / processedData.length,
  };
  
  return {
    processedData,
    stats,
  };
}`,
          },
        },
      },
      {
        id: 'step-3',
        type: 'step',
        position: { x: 700, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataAnalyzer',
            description: 'Perform statistical analysis on processed data',
            inputSchema: [
              { name: 'data', type: 'array', required: true },
              createSchemaField('analysisType', 'string', false),
            ],
            outputSchema: [createSchemaField('analysis', 'object', true), createSchemaField('insights', 'array', true)],
            executeCode: `async ({ data, analysisType = 'basic' }) => {
  const values = data.map(item => item.value);
  const analysis = {
    mean: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: values.sort()[Math.floor(values.length / 2)],
    min: Math.min(...values),
    max: Math.max(...values),
    std: Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - analysis.mean, 2), 0) / values.length),
  };
  
  const insights = [
    'Data shows normal distribution',
    'Average value is within expected range',
    'No significant outliers detected',
  ];
  
  return {
    analysis,
    insights,
  };
}`,
          },
        },
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 400, y: 400 },
        data: {
          type: 'agent',
          config: {
            id: 'reportingAgent',
            name: 'Reporting Agent',
            description: 'Generate comprehensive reports from analysis results',
            tools: ['chartGeneratorTool', 'reportTemplateTool'],
            workflows: ['reportingWorkflow'],
            agents: [],
            instructions: `You are a data reporting specialist. Your role is to:

1. Interpret analysis results and statistics
2. Generate clear and actionable insights
3. Create comprehensive reports with visualizations
4. Present findings in an understandable format
5. Provide recommendations based on data

Focus on clarity, accuracy, and actionable insights.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 15 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 200, y: 600 },
        data: {
          type: 'tool',
          config: {
            id: 'chartGeneratorTool',
            description: 'Generate charts and visualizations from data',
            inputSchema: [createSchemaField('data', 'array', true), createSchemaField('chartType', 'string', true)],
            outputSchema: [
              createSchemaField('chartUrl', 'string', true),
              createSchemaField('chartData', 'object', true),
            ],
            executeCode: `async ({ data, chartType }) => {
  // Mock chart generation
  return {
    chartUrl: 'https://example.com/chart.png',
    chartData: {
      type: chartType,
      data: data,
      generatedAt: new Date().toISOString(),
    },
  };
}`,
          },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 600, y: 600 },
        data: {
          type: 'tool',
          config: {
            id: 'reportTemplateTool',
            description: 'Generate formatted reports using templates',
            inputSchema: [createSchemaField('data', 'object', true), createSchemaField('template', 'string', false)],
            outputSchema: [createSchemaField('report', 'string', true), createSchemaField('format', 'string', true)],
            executeCode: `async ({ data, template = 'standard' }) => {
  const report = \`# Data Analysis Report
Generated: \${new Date().toISOString()}

## Summary
Total records analyzed: \${data.stats?.processedCount || 0}

## Key Insights
\${data.insights?.map(insight => \`- \${insight}\`).join('\\n') || 'No insights available'}

## Statistics
- Mean: \${data.analysis?.mean?.toFixed(2) || 'N/A'}
- Median: \${data.analysis?.median?.toFixed(2) || 'N/A'}
- Min: \${data.analysis?.min || 'N/A'}
- Max: \${data.analysis?.max || 'N/A'}
\`;

  return {
    report,
    format: 'markdown',
  };
}`,
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'step-1', target: 'step-2', type: 'default' },
      { id: 'e2', source: 'step-2', target: 'step-3', type: 'default' },
      { id: 'e3', source: 'step-3', target: 'agent-1', type: 'default' },
      { id: 'e4', source: 'agent-1', target: 'tool-1', type: 'default' },
      { id: 'e5', source: 'agent-1', target: 'tool-2', type: 'default' },
    ],
  },
};

export const emailAutomationSystemTemplate: Template = {
  id: 'email-automation-system',
  name: 'Email Automation System',
  description: 'Complete email automation system with personalization, scheduling, and tracking.',
  icon: '📧',
  category: 'complete',
  tags: ['email', 'automation', 'personalization', 'tracking'],
  project: {
    id: 'email-automation-system-project',
    name: 'Email Automation System',
    settings: {
      projectName: 'Email Automation System',
      description: 'Automated email marketing and communication system',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: true },
      environmentVariables: {
        SMTP_HOST: '',
        SMTP_USER: '',
        SMTP_PASS: '',
        EMAIL_DB_URL: '',
      },
    },
    nodes: [
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 200, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'emailPersonalizationAgent',
            name: 'Email Personalization Agent',
            description: 'Agent that personalizes email content based on recipient data',
            tools: ['userDataTool', 'templateTool'],
            workflows: ['personalizationWorkflow'],
            agents: [],
            instructions: `You are an email personalization specialist. Your role is to:

1. Analyze recipient data and preferences
2. Personalize email content and subject lines
3. Select appropriate templates and content
4. Ensure personalization feels natural and relevant
5. Maintain brand voice and messaging consistency

Focus on creating engaging, personalized experiences.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 15 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 500, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'emailSchedulerAgent',
            name: 'Email Scheduler Agent',
            description: 'Agent that manages email scheduling and delivery optimization',
            tools: ['schedulingTool', 'deliveryTool'],
            workflows: ['schedulingWorkflow'],
            agents: [],
            instructions: `You are an email scheduling specialist. Your role is to:

1. Determine optimal send times for each recipient
2. Manage email queue and delivery priorities
3. Handle timezone considerations
4. Optimize delivery rates and engagement
5. Monitor and adjust scheduling strategies

Focus on maximizing email engagement and deliverability.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 10 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 200, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'userDataTool',
            description: 'Retrieve and analyze user data for personalization',
            inputSchema: [createSchemaField('userId', 'string', true), createSchemaField('dataTypes', 'array', false)],
            outputSchema: [
              createSchemaField('userData', 'object', true),
              createSchemaField('preferences', 'object', true),
            ],
            executeCode: `async ({ userId, dataTypes = ['profile', 'behavior', 'preferences'] }) => {
  // Mock user data retrieval
  return {
    userData: {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      location: 'New York',
      interests: ['technology', 'business'],
    },
    preferences: {
      frequency: 'weekly',
      topics: ['tech-news', 'business-updates'],
      timezone: 'America/New_York',
    },
  };
}`,
          },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 500, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'templateTool',
            description: 'Manage email templates and content',
            inputSchema: [
              createSchemaField('templateId', 'string', true),
              createSchemaField('variables', 'object', false),
            ],
            outputSchema: [createSchemaField('content', 'string', true), createSchemaField('subject', 'string', true)],
            executeCode: `async ({ templateId, variables = {} }) => {
  // Mock template processing
  const templates = {
    welcome: {
      subject: 'Welcome to {{company}}, {{name}}!',
      content: 'Hi {{name}},\\n\\nWelcome to {{company}}! We\'re excited to have you on board.\\n\\nBest regards,\\nThe Team',
    },
    newsletter: {
      subject: '{{topic}} Update - {{date}}',
      content: 'Hi {{name}},\\n\\nHere\'s your {{topic}} update for {{date}}.\\n\\n{{content}}\\n\\nThanks for reading!',
    },
  };
  
  const template = templates[templateId] || templates.newsletter;
  let content = template.content;
  let subject = template.subject;
  
  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(\`{{\${key}}}\`, 'g'), value);
    subject = subject.replace(new RegExp(\`{{\${key}}}\`, 'g'), value);
  });
  
  return { content, subject };
}`,
          },
        },
      },
      {
        id: 'tool-3',
        type: 'tool',
        position: { x: 800, y: 400 },
        data: {
          type: 'tool',
          config: {
            id: 'emailSenderTool',
            description: 'Send personalized emails with tracking',
            inputSchema: [
              createSchemaField('to', 'string', true),
              createSchemaField('subject', 'string', true),
              createSchemaField('content', 'string', true),
              createSchemaField('tracking', 'boolean', false),
            ],
            outputSchema: [
              createSchemaField('messageId', 'string', true),
              createSchemaField('sentAt', 'string', true),
              createSchemaField('trackingId', 'string', false),
            ],
            executeCode: `async ({ to, subject, content, tracking = true }) => {
  const messageId = \`msg_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  const trackingId = tracking ? \`track_\${messageId}\` : undefined;
  
  // Mock email sending
  console.log(\`Sending email to \${to}: \${subject}\`);
  
  return {
    messageId,
    sentAt: new Date().toISOString(),
    trackingId,
  };
}`,
          },
        },
      },
      {
        id: 'step-1',
        type: 'step',
        position: { x: 350, y: 600 },
        data: {
          type: 'step',
          config: {
            id: 'emailCampaignStep',
            description: 'Execute email campaign with personalization and scheduling',
            inputSchema: [
              createSchemaField('campaignId', 'string', true),
              createSchemaField('recipients', 'array', true),
            ],
            outputSchema: [
              createSchemaField('sent', 'number', true),
              createSchemaField('failed', 'number', true),
              createSchemaField('campaignId', 'string', true),
            ],
            executeCode: `async ({ campaignId, recipients }) => {
  let sent = 0;
  let failed = 0;
  
  for (const recipient of recipients) {
    try {
      // Mock sending process
      sent++;
    } catch (error) {
      failed++;
    }
  }
  
  return {
    sent,
    failed,
    campaignId,
  };
}`,
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'agent-1', target: 'tool-1', type: 'default' },
      { id: 'e2', source: 'agent-1', target: 'tool-2', type: 'default' },
      { id: 'e3', source: 'agent-2', target: 'tool-3', type: 'default' },
      { id: 'e4', source: 'step-1', target: 'agent-1', type: 'default' },
      { id: 'e5', source: 'step-1', target: 'agent-2', type: 'default' },
      { id: 'e6', source: 'agent-1', target: 'agent-2', type: 'default' },
    ],
  },
};

export const multiAgentResearchSystemTemplate: Template = {
  id: 'multi-agent-research-system',
  name: 'Multi-Agent Research System',
  description: 'Collaborative research system with specialized agents for different research domains.',
  icon: '🔬',
  category: 'complete',
  tags: ['research', 'multi-agent', 'collaboration', 'analysis'],
  project: {
    id: 'multi-agent-research-system-project',
    name: 'Multi-Agent Research System',
    settings: {
      projectName: 'Multi-Agent Research System',
      description: 'Collaborative AI research system with specialized agents',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: true },
      environmentVariables: {
        OPENAI_API_KEY: '',
        RESEARCH_DB_URL: '',
      },
    },
    nodes: [
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 100, y: 200 },
        data: {
          type: 'agent',
          config: {
            id: 'researchCoordinatorAgent',
            name: 'Research Coordinator Agent',
            description: 'Coordinates research activities and synthesizes findings',
            tools: ['researchDatabaseTool', 'synthesisTool'],
            workflows: ['coordinationWorkflow'],
            agents: ['academicResearchAgent', 'marketResearchAgent', 'technicalResearchAgent'],
            instructions: `You are a research coordinator. Your role is to:

1. Break down research questions into specialized tasks
2. Coordinate with specialized research agents
3. Synthesize findings from multiple sources
4. Ensure comprehensive coverage of research topics
5. Generate final research reports

Focus on comprehensive research coordination and synthesis.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 25 },
            maxRetries: 3,
          },
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 400, y: 100 },
        data: {
          type: 'agent',
          config: {
            id: 'academicResearchAgent',
            name: 'Academic Research Agent',
            description: 'Specialized in academic research and scholarly sources',
            tools: ['academicSearchTool', 'citationTool'],
            workflows: ['academicWorkflow'],
            agents: [],
            instructions: `You are an academic research specialist. Your role is to:

1. Search academic databases and scholarly sources
2. Analyze peer-reviewed research and studies
3. Extract key findings and methodologies
4. Identify research gaps and opportunities
5. Provide academic perspectives and citations

Focus on academic rigor and scholarly sources.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 20 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'agent-3',
        type: 'agent',
        position: { x: 700, y: 100 },
        data: {
          type: 'agent',
          config: {
            id: 'marketResearchAgent',
            name: 'Market Research Agent',
            description: 'Specialized in market research and business intelligence',
            tools: ['marketDataTool', 'competitorAnalysisTool'],
            workflows: ['marketWorkflow'],
            agents: [],
            instructions: `You are a market research specialist. Your role is to:

1. Analyze market trends and business intelligence
2. Research competitor strategies and positioning
3. Identify market opportunities and threats
4. Gather consumer insights and preferences
5. Provide market analysis and recommendations

Focus on market intelligence and business insights.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 20 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'agent-4',
        type: 'agent',
        position: { x: 1000, y: 100 },
        data: {
          type: 'agent',
          config: {
            id: 'technicalResearchAgent',
            name: 'Technical Research Agent',
            description: 'Specialized in technical research and implementation details',
            tools: ['technicalSearchTool', 'codeAnalysisTool'],
            workflows: ['technicalWorkflow'],
            agents: [],
            instructions: `You are a technical research specialist. Your role is to:

1. Research technical implementations and solutions
2. Analyze code repositories and technical documentation
3. Identify technical trends and innovations
4. Evaluate technical feasibility and requirements
5. Provide technical recommendations and insights

Focus on technical depth and implementation details.`,
            model: { provider: 'openai', name: 'gpt-4' },
            memory: { type: 'buffer', maxMessages: 20 },
            maxRetries: 2,
          },
        },
      },
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'academicSearchTool',
            description: 'Search academic databases and scholarly sources',
            inputSchema: [createSchemaField('query', 'string', true), createSchemaField('database', 'string', false)],
            outputSchema: [createSchemaField('papers', 'array', true), createSchemaField('citations', 'number', true)],
            executeCode: `async ({ query, database = 'all' }) => {
  // Mock academic search
  return {
    papers: [
      {
        title: 'Sample Academic Paper',
        authors: ['Dr. Jane Smith', 'Prof. John Doe'],
        journal: 'Journal of Research',
        year: 2023,
        abstract: 'This is a sample academic paper abstract...',
        citations: 42,
      },
    ],
    citations: 42,
  };
}`,
          },
        },
      },
      {
        id: 'tool-2',
        type: 'tool',
        position: { x: 700, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'marketDataTool',
            description: 'Retrieve market data and business intelligence',
            inputSchema: [createSchemaField('industry', 'string', true), createSchemaField('metrics', 'array', false)],
            outputSchema: [createSchemaField('marketData', 'object', true), createSchemaField('trends', 'array', true)],
            executeCode: `async ({ industry, metrics = ['size', 'growth', 'competitors'] }) => {
  return {
    marketData: {
      industry,
      size: '$100B',
      growth: '15%',
      competitors: ['Company A', 'Company B', 'Company C'],
    },
    trends: [
      'Growing demand for AI solutions',
      'Increased focus on automation',
      'Rising importance of data privacy',
    ],
  };
}`,
          },
        },
      },
      {
        id: 'tool-3',
        type: 'tool',
        position: { x: 1000, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'technicalSearchTool',
            description: 'Search technical documentation and code repositories',
            inputSchema: [createSchemaField('query', 'string', true), createSchemaField('source', 'string', false)],
            outputSchema: [
              createSchemaField('results', 'array', true),
              createSchemaField('repositories', 'array', true),
            ],
            executeCode: `async ({ query, source = 'github' }) => {
  return {
    results: [
      {
        title: 'Sample Technical Documentation',
        url: 'https://docs.example.com',
        description: 'Technical documentation for the query',
        stars: 1500,
      },
    ],
    repositories: [
      {
        name: 'sample-repo',
        description: 'Sample repository',
        stars: 500,
        language: 'TypeScript',
      },
    ],
  };
}`,
          },
        },
      },
      {
        id: 'tool-4',
        type: 'tool',
        position: { x: 100, y: 500 },
        data: {
          type: 'tool',
          config: {
            id: 'synthesisTool',
            description: 'Synthesize research findings from multiple sources',
            inputSchema: [
              createSchemaField('findings', 'array', true),
              createSchemaField('perspective', 'string', false),
            ],
            outputSchema: [
              createSchemaField('synthesis', 'string', true),
              createSchemaField('keyInsights', 'array', true),
            ],
            executeCode: `async ({ findings, perspective = 'comprehensive' }) => {
  const synthesis = \`Based on the research findings from \${findings.length} sources, the key insights are:\`;
  const keyInsights = [
    'Multiple perspectives converge on similar conclusions',
    'Research gaps identified in specific areas',
    'Emerging trends across different domains',
  ];
  
  return {
    synthesis,
    keyInsights,
  };
}`,
          },
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'agent-1', target: 'agent-2', type: 'default' },
      { id: 'e2', source: 'agent-1', target: 'agent-3', type: 'default' },
      { id: 'e3', source: 'agent-1', target: 'agent-4', type: 'default' },
      { id: 'e4', source: 'agent-2', target: 'tool-1', type: 'default' },
      { id: 'e5', source: 'agent-3', target: 'tool-2', type: 'default' },
      { id: 'e6', source: 'agent-4', target: 'tool-3', type: 'default' },
      { id: 'e7', source: 'agent-1', target: 'tool-4', type: 'default' },
      { id: 'e8', source: 'agent-2', target: 'agent-1', type: 'default' },
      { id: 'e9', source: 'agent-3', target: 'agent-1', type: 'default' },
      { id: 'e10', source: 'agent-4', target: 'agent-1', type: 'default' },
    ],
  },
};
