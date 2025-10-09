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

export const httpRequestToolTemplate: Template = {
  id: 'http-request-tool',
  name: 'HTTP Request Tool',
  description: 'Make HTTP requests to external APIs with configurable methods, headers, and authentication.',
  icon: '🌐',
  category: 'tool',
  tags: ['http', 'api', 'requests', 'external'],
  project: {
    id: 'http-request-tool-project',
    name: 'HTTP Request Tool',
    settings: {
      projectName: 'HTTP Request Tool',
      description: 'A reusable tool for making HTTP requests',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {},
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'httpRequestTool',
            description: 'Make HTTP requests to external APIs',
            inputSchema: [
              createSchemaField('url', 'string', true),
              createSchemaField('method', 'string', false),
              createSchemaField('headers', 'object', false),
              createSchemaField('body', 'string', false),
            ],
            outputSchema: [
              createSchemaField('status', 'number', true),
              createSchemaField('data', 'object', true),
              createSchemaField('headers', 'object', true),
            ],
            executeCode: `async ({ url, method = 'GET', headers = {}, body }) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    return {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    throw new Error(\`HTTP request failed: \${error.message}\`);
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const databaseQueryToolTemplate: Template = {
  id: 'database-query-tool',
  name: 'Database Query Tool',
  description: 'Execute SQL queries against a database with connection management and error handling.',
  icon: '🗄️',
  category: 'tool',
  tags: ['database', 'sql', 'query', 'data'],
  project: {
    id: 'database-query-tool-project',
    name: 'Database Query Tool',
    settings: {
      projectName: 'Database Query Tool',
      description: 'A reusable tool for database operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        DATABASE_URL: '',
      },
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'databaseQueryTool',
            description: 'Execute SQL queries against a database',
            inputSchema: [createSchemaField('query', 'string', true), createSchemaField('parameters', 'array', false)],
            outputSchema: [createSchemaField('rows', 'array', true), createSchemaField('rowCount', 'number', true)],
            executeCode: `async ({ query, parameters = [] }) => {
  // Note: This is a template - you'll need to implement actual database connection
  // using your preferred database library (e.g., pg, mysql2, sqlite3)
  
  try {
    // Example implementation for PostgreSQL with pg library:
    // const { Pool } = require('pg');
    // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // const result = await pool.query(query, parameters);
    
    // For now, return mock data
    return {
      rows: [],
      rowCount: 0,
    };
  } catch (error) {
    throw new Error(\`Database query failed: \${error.message}\`);
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const fileOperationsToolTemplate: Template = {
  id: 'file-operations-tool',
  name: 'File Operations Tool',
  description: 'Read, write, and manage files with support for various formats and operations.',
  icon: '📁',
  category: 'tool',
  tags: ['file', 'io', 'read', 'write', 'storage'],
  project: {
    id: 'file-operations-tool-project',
    name: 'File Operations Tool',
    settings: {
      projectName: 'File Operations Tool',
      description: 'A reusable tool for file operations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {},
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'fileOperationsTool',
            description: 'Read, write, and manage files',
            inputSchema: [
              createSchemaField('operation', 'string', true),
              createSchemaField('path', 'string', true),
              createSchemaField('content', 'string', false),
            ],
            outputSchema: [
              createSchemaField('success', 'boolean', true),
              createSchemaField('content', 'string', false),
              createSchemaField('message', 'string', true),
            ],
            executeCode: `async ({ operation, path, content }) => {
  const fs = require('fs').promises;
  
  try {
    switch (operation) {
      case 'read':
        const fileContent = await fs.readFile(path, 'utf8');
        return {
          success: true,
          content: fileContent,
          message: 'File read successfully',
        };
      
      case 'write':
        await fs.writeFile(path, content, 'utf8');
        return {
          success: true,
          message: 'File written successfully',
        };
      
      case 'exists':
        try {
          await fs.access(path);
          return {
            success: true,
            message: 'File exists',
          };
        } catch {
          return {
            success: false,
            message: 'File does not exist',
          };
        }
      
      default:
        throw new Error(\`Unknown operation: \${operation}\`);
    }
  } catch (error) {
    return {
      success: false,
      message: \`File operation failed: \${error.message}\`,
    };
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const emailSenderToolTemplate: Template = {
  id: 'email-sender-tool',
  name: 'Email Sender Tool',
  description: 'Send emails with HTML/text content, attachments, and configurable SMTP settings.',
  icon: '📧',
  category: 'tool',
  tags: ['email', 'smtp', 'notification', 'communication'],
  project: {
    id: 'email-sender-tool-project',
    name: 'Email Sender Tool',
    settings: {
      projectName: 'Email Sender Tool',
      description: 'A reusable tool for sending emails',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        SMTP_HOST: '',
        SMTP_PORT: '587',
        SMTP_USER: '',
        SMTP_PASS: '',
      },
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'emailSenderTool',
            description: 'Send emails with configurable content and recipients',
            inputSchema: [
              createSchemaField('to', 'string', true),
              createSchemaField('subject', 'string', true),
              createSchemaField('html', 'string', false),
              createSchemaField('text', 'string', false),
              createSchemaField('from', 'string', false),
            ],
            outputSchema: [
              createSchemaField('success', 'boolean', true),
              createSchemaField('messageId', 'string', false),
              createSchemaField('message', 'string', true),
            ],
            executeCode: `async ({ to, subject, html, text, from }) => {
  // Note: This is a template - you'll need to implement actual email sending
  // using your preferred email library (e.g., nodemailer, sendgrid, etc.)
  
  try {
    // Example implementation with nodemailer:
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    // 
    // const info = await transporter.sendMail({
    //   from: from || process.env.SMTP_USER,
    //   to,
    //   subject,
    //   html,
    //   text,
    // });
    
    // For now, return mock success
    return {
      success: true,
      messageId: 'mock-message-id',
      message: 'Email sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: \`Email sending failed: \${error.message}\`,
    };
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const calculatorToolTemplate: Template = {
  id: 'calculator-tool',
  name: 'Calculator Tool',
  description: 'Perform mathematical calculations with support for basic operations and expressions.',
  icon: '🧮',
  category: 'tool',
  tags: ['math', 'calculation', 'arithmetic', 'expression'],
  project: {
    id: 'calculator-tool-project',
    name: 'Calculator Tool',
    settings: {
      projectName: 'Calculator Tool',
      description: 'A reusable tool for mathematical calculations',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {},
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'calculatorTool',
            description: 'Perform mathematical calculations',
            inputSchema: [createSchemaField('expression', 'string', true)],
            outputSchema: [
              createSchemaField('result', 'number', true),
              createSchemaField('expression', 'string', true),
            ],
            executeCode: `async ({ expression }) => {
  try {
    // Basic safety check - only allow numbers, operators, and parentheses
    const safeExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
    
    if (safeExpression !== expression) {
      throw new Error('Invalid characters in expression');
    }
    
    // Evaluate the expression safely
    const result = Function('"use strict"; return (' + safeExpression + ')')();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid mathematical expression');
    }
    
    return {
      result,
      expression: safeExpression,
    };
  } catch (error) {
    throw new Error(\`Calculation failed: \${error.message}\`);
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const slackNotificationToolTemplate: Template = {
  id: 'slack-notification-tool',
  name: 'Slack Notification Tool',
  description: 'Send messages and notifications to Slack channels with rich formatting and attachments.',
  icon: '💬',
  category: 'tool',
  tags: ['slack', 'notification', 'messaging', 'integration'],
  project: {
    id: 'slack-notification-tool-project',
    name: 'Slack Notification Tool',
    settings: {
      projectName: 'Slack Notification Tool',
      description: 'A reusable tool for Slack notifications',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        SLACK_BOT_TOKEN: '',
        SLACK_CHANNEL: '',
      },
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'slackNotificationTool',
            description: 'Send messages to Slack channels',
            inputSchema: [
              createSchemaField('channel', 'string', true),
              createSchemaField('text', 'string', true),
              createSchemaField('blocks', 'array', false),
              createSchemaField('attachments', 'array', false),
            ],
            outputSchema: [
              createSchemaField('success', 'boolean', true),
              createSchemaField('ts', 'string', false),
              createSchemaField('message', 'string', true),
            ],
            executeCode: `async ({ channel, text, blocks, attachments }) => {
  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.SLACK_BOT_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text,
        blocks,
        attachments,
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Slack API error');
    }
    
    return {
      success: true,
      ts: data.ts,
      message: 'Message sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: \`Slack notification failed: \${error.message}\`,
    };
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};

export const discordWebhookToolTemplate: Template = {
  id: 'discord-webhook-tool',
  name: 'Discord Webhook Tool',
  description: 'Send messages to Discord channels via webhooks with embeds and rich formatting.',
  icon: '🎮',
  category: 'tool',
  tags: ['discord', 'webhook', 'notification', 'gaming'],
  project: {
    id: 'discord-webhook-tool-project',
    name: 'Discord Webhook Tool',
    settings: {
      projectName: 'Discord Webhook Tool',
      description: 'A reusable tool for Discord webhooks',
      defaultModel: { provider: 'openai', name: 'gpt-4' },
      storage: { type: 'memory' },
      logger: { type: 'console' },
      telemetry: { enabled: false },
      environmentVariables: {
        DISCORD_WEBHOOK_URL: '',
      },
    },
    nodes: [
      {
        id: 'tool-1',
        type: 'tool',
        position: { x: 400, y: 300 },
        data: {
          type: 'tool',
          config: {
            id: 'discordWebhookTool',
            description: 'Send messages to Discord via webhooks',
            inputSchema: [
              createSchemaField('content', 'string', false),
              createSchemaField('username', 'string', false),
              createSchemaField('avatar_url', 'string', false),
              createSchemaField('embeds', 'array', false),
            ],
            outputSchema: [createSchemaField('success', 'boolean', true), createSchemaField('message', 'string', true)],
            executeCode: `async ({ content, username, avatar_url, embeds }) => {
  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        username,
        avatar_url,
        embeds,
      }),
    });

    if (!response.ok) {
      throw new Error(\`Discord webhook failed: \${response.statusText}\`);
    }
    
    return {
      success: true,
      message: 'Message sent to Discord successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: \`Discord webhook failed: \${error.message}\`,
    };
  }
}`,
          },
        },
      },
    ],
    edges: [],
  },
};
