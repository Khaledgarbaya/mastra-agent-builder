import type { WorkflowTemplate } from './templateTypes';

export const dataProcessingWorkflow: WorkflowTemplate = {
  id: 'data-processing-workflow',
  name: 'Data Processing Pipeline',
  description: 'Complete workflow for processing, cleaning, and analyzing data',
  category: 'workflow',
  icon: '🔄',
  tags: ['data', 'processing', 'pipeline', 'etl'],
  workflowConfig: {
    name: 'DataProcessingWorkflow',
    description: 'Workflow for processing, cleaning, and analyzing data',
    steps: [
      {
        id: 'step-1',
        type: 'step',
        config: {
          id: 'dataInput',
          description: 'Load and validate input data',
          executeCode: `async ({ inputData }) => {
  // Load and validate input data
  console.log('Loading data:', inputData);
  
  // Basic validation
  if (!inputData || typeof inputData !== 'object') {
    throw new Error('Invalid input data');
  }
  
  return {
    rawData: inputData,
    timestamp: new Date().toISOString(),
    recordCount: Array.isArray(inputData) ? inputData.length : 1
  };
}`,
        },
      },
      {
        id: 'step-2',
        type: 'step',
        config: {
          id: 'dataClean',
          description: 'Clean and normalize data',
          executeCode: `async ({ rawData, recordCount }) => {
  console.log('Cleaning data...');
  
  // Clean data based on type
  let cleanedData;
  
  if (Array.isArray(rawData)) {
    cleanedData = rawData.map(item => {
      // Remove null/undefined values
      const cleaned = {};
      for (const [key, value] of Object.entries(item)) {
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }).filter(item => Object.keys(item).length > 0);
  } else {
    // Clean single object
    const cleaned = {};
    for (const [key, value] of Object.entries(rawData)) {
      if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    cleanedData = cleaned;
  }
  
  return {
    cleanedData,
    originalCount: recordCount,
    cleanedCount: Array.isArray(cleanedData) ? cleanedData.length : 1
  };
}`,
        },
      },
      {
        id: 'step-3',
        type: 'step',
        config: {
          id: 'dataTransform',
          description: 'Transform data format and structure',
          executeCode: `async ({ cleanedData }) => {
  console.log('Transforming data...');
  
  // Apply transformations
  const transformed = Array.isArray(cleanedData) 
    ? cleanedData.map(item => ({
        ...item,
        processedAt: new Date().toISOString(),
        // Add any specific transformations here
      }))
    : {
        ...cleanedData,
        processedAt: new Date().toISOString(),
      };
  
  return {
    transformedData: transformed,
    transformationDate: new Date().toISOString()
  };
}`,
        },
      },
      {
        id: 'step-4',
        type: 'step',
        config: {
          id: 'dataOutput',
          description: 'Save processed data and generate report',
          executeCode: `async ({ transformedData, transformationDate }) => {
  console.log('Saving processed data...');
  
  // Generate summary report
  const report = {
    processingDate: transformationDate,
    recordCount: Array.isArray(transformedData) ? transformedData.length : 1,
    status: 'completed',
    summary: 'Data processing completed successfully'
  };
  
  return {
    processedData: transformedData,
    report,
    success: true
  };
}`,
        },
      },
    ],
    connections: [
      { source: 'step-1', target: 'step-2' },
      { source: 'step-2', target: 'step-3' },
      { source: 'step-3', target: 'step-4' },
    ],
  },
  project: {
    id: 'template-data-processing',
    name: 'Data Processing Pipeline Template',
    description: 'Complete workflow for processing, cleaning, and analyzing data',
    nodes: [
      {
        id: 'step-1',
        type: 'step',
        position: { x: 200, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataInput',
            description: 'Load and validate input data',
            executeCode: `async ({ inputData }) => {
  // Load and validate input data
  console.log('Loading data:', inputData);
  
  // Basic validation
  if (!inputData || typeof inputData !== 'object') {
    throw new Error('Invalid input data');
  }
  
  return {
    rawData: inputData,
    timestamp: new Date().toISOString(),
    recordCount: Array.isArray(inputData) ? inputData.length : 1
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
            id: 'dataClean',
            description: 'Clean and normalize data',
            executeCode: `async ({ rawData, recordCount }) => {
  console.log('Cleaning data...');
  
  // Clean data based on type
  let cleanedData;
  
  if (Array.isArray(rawData)) {
    cleanedData = rawData.map(item => {
      // Remove null/undefined values
      const cleaned = {};
      for (const [key, value] of Object.entries(item)) {
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }).filter(item => Object.keys(item).length > 0);
  } else {
    // Clean single object
    const cleaned = {};
    for (const [key, value] of Object.entries(rawData)) {
      if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    cleanedData = cleaned;
  }
  
  return {
    cleanedData,
    originalCount: recordCount,
    cleanedCount: Array.isArray(cleanedData) ? cleanedData.length : 1
  };
}`,
          },
        },
      },
      {
        id: 'step-3',
        type: 'step',
        position: { x: 600, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataTransform',
            description: 'Transform data format and structure',
            executeCode: `async ({ cleanedData }) => {
  console.log('Transforming data...');
  
  // Apply transformations
  const transformed = Array.isArray(cleanedData) 
    ? cleanedData.map(item => ({
        ...item,
        processedAt: new Date().toISOString(),
        // Add any specific transformations here
      }))
    : {
        ...cleanedData,
        processedAt: new Date().toISOString(),
      };
  
  return {
    transformedData: transformed,
    transformationDate: new Date().toISOString()
  };
}`,
          },
        },
      },
      {
        id: 'step-4',
        type: 'step',
        position: { x: 800, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'dataOutput',
            description: 'Save processed data and generate report',
            executeCode: `async ({ transformedData, transformationDate }) => {
  console.log('Saving processed data...');
  
  // Generate summary report
  const report = {
    processingDate: transformationDate,
    recordCount: Array.isArray(transformedData) ? transformedData.length : 1,
    status: 'completed',
    summary: 'Data processing completed successfully'
  };
  
  return {
    processedData: transformedData,
    report,
    success: true
  };
}`,
          },
        },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'step-1',
        target: 'step-2',
      },
      {
        id: 'edge-2',
        source: 'step-2',
        target: 'step-3',
      },
      {
        id: 'edge-3',
        source: 'step-3',
        target: 'step-4',
      },
    ],
    settings: {
      storage: { type: 'libsql' },
      logger: { type: 'pino' },
      telemetry: { enabled: true },
    },
  },
};

export const contentGenerationWorkflow: WorkflowTemplate = {
  id: 'content-generation-workflow',
  name: 'Content Generation Workflow',
  description: 'Automated workflow for generating and reviewing content',
  category: 'workflow',
  icon: '📝',
  tags: ['content', 'generation', 'writing', 'review'],
  workflowConfig: {
    name: 'ContentGenerationWorkflow',
    description: 'Workflow for generating and reviewing content',
    steps: [
      {
        id: 'step-1',
        type: 'step',
        config: {
          id: 'contentBrief',
          description: 'Analyze content brief and requirements',
          executeCode: `async ({ brief, requirements }) => {
  console.log('Analyzing content brief...');
  
  return {
    topic: brief.topic,
    targetAudience: brief.audience,
    tone: brief.tone || 'professional',
    length: brief.length || 'medium',
    keywords: brief.keywords || [],
    requirements: requirements
  };
}`,
        },
      },
      {
        id: 'step-2',
        type: 'step',
        config: {
          id: 'contentOutline',
          description: 'Generate content outline and structure',
          executeCode: `async ({ topic, targetAudience, tone, length }) => {
  console.log('Generating content outline...');
  
  const outline = {
    title: \`Comprehensive Guide: \${topic}\`,
    sections: [
      { title: 'Introduction', description: 'Hook and overview' },
      { title: 'Main Content', description: 'Core information and insights' },
      { title: 'Examples', description: 'Practical examples and use cases' },
      { title: 'Conclusion', description: 'Summary and next steps' }
    ],
    wordCount: length === 'short' ? 500 : length === 'long' ? 2000 : 1000,
    tone: tone
  };
  
  return {
    outline,
    generatedAt: new Date().toISOString()
  };
}`,
        },
      },
      {
        id: 'step-3',
        type: 'step',
        config: {
          id: 'contentDraft',
          description: 'Generate initial content draft',
          executeCode: `async ({ outline, keywords }) => {
  console.log('Generating content draft...');
  
  const draft = {
    title: outline.title,
    content: \`
# \${outline.title}

## Introduction
This comprehensive guide covers \${outline.title.toLowerCase()}, providing valuable insights and practical examples.

## Main Content
[Content will be generated based on the topic and requirements]

## Examples
[Practical examples and use cases will be included here]

## Conclusion
[Summary and actionable next steps will be provided]
\`,
    wordCount: outline.wordCount,
    keywords: keywords,
    generatedAt: new Date().toISOString()
  };
  
  return {
    draft,
    status: 'draft_complete'
  };
}`,
        },
      },
      {
        id: 'step-4',
        type: 'step',
        config: {
          id: 'contentReview',
          description: 'Review and optimize content',
          executeCode: `async ({ draft }) => {
  console.log('Reviewing content...');
  
  const review = {
    originalDraft: draft.content,
    suggestions: [
      'Add more specific examples',
      'Include relevant statistics',
      'Optimize for target keywords'
    ],
    qualityScore: 85,
    readyForPublish: false,
    reviewDate: new Date().toISOString()
  };
  
  return {
    review,
    status: 'review_complete'
  };
}`,
        },
      },
    ],
    connections: [
      { source: 'step-1', target: 'step-2' },
      { source: 'step-2', target: 'step-3' },
      { source: 'step-3', target: 'step-4' },
    ],
  },
  project: {
    id: 'template-content-generation',
    name: 'Content Generation Workflow Template',
    description: 'Automated workflow for generating and reviewing content',
    nodes: [
      {
        id: 'step-1',
        type: 'step',
        position: { x: 200, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'contentBrief',
            description: 'Analyze content brief and requirements',
            executeCode: `async ({ brief, requirements }) => {
  console.log('Analyzing content brief...');
  
  return {
    topic: brief.topic,
    targetAudience: brief.audience,
    tone: brief.tone || 'professional',
    length: brief.length || 'medium',
    keywords: brief.keywords || [],
    requirements: requirements
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
            id: 'contentOutline',
            description: 'Generate content outline and structure',
            executeCode: `async ({ topic, targetAudience, tone, length }) => {
  console.log('Generating content outline...');
  
  const outline = {
    title: \`Comprehensive Guide: \${topic}\`,
    sections: [
      { title: 'Introduction', description: 'Hook and overview' },
      { title: 'Main Content', description: 'Core information and insights' },
      { title: 'Examples', description: 'Practical examples and use cases' },
      { title: 'Conclusion', description: 'Summary and next steps' }
    ],
    wordCount: length === 'short' ? 500 : length === 'long' ? 2000 : 1000,
    tone: tone
  };
  
  return {
    outline,
    generatedAt: new Date().toISOString()
  };
}`,
          },
        },
      },
      {
        id: 'step-3',
        type: 'step',
        position: { x: 600, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'contentDraft',
            description: 'Generate initial content draft',
            executeCode: `async ({ outline, keywords }) => {
  console.log('Generating content draft...');
  
  const draft = {
    title: outline.title,
    content: \`
# \${outline.title}

## Introduction
This comprehensive guide covers \${outline.title.toLowerCase()}, providing valuable insights and practical examples.

## Main Content
[Content will be generated based on the topic and requirements]

## Examples
[Practical examples and use cases will be included here]

## Conclusion
[Summary and actionable next steps will be provided]
\`,
    wordCount: outline.wordCount,
    keywords: keywords,
    generatedAt: new Date().toISOString()
  };
  
  return {
    draft,
    status: 'draft_complete'
  };
}`,
          },
        },
      },
      {
        id: 'step-4',
        type: 'step',
        position: { x: 800, y: 200 },
        data: {
          type: 'step',
          config: {
            id: 'contentReview',
            description: 'Review and optimize content',
            executeCode: `async ({ draft }) => {
  console.log('Reviewing content...');
  
  const review = {
    originalDraft: draft.content,
    suggestions: [
      'Add more specific examples',
      'Include relevant statistics',
      'Optimize for target keywords'
    ],
    qualityScore: 85,
    readyForPublish: false,
    reviewDate: new Date().toISOString()
  };
  
  return {
    review,
    status: 'review_complete'
  };
}`,
          },
        },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'step-1',
        target: 'step-2',
      },
      {
        id: 'edge-2',
        source: 'step-2',
        target: 'step-3',
      },
      {
        id: 'edge-3',
        source: 'step-3',
        target: 'step-4',
      },
    ],
    settings: {
      storage: { type: 'libsql' },
      logger: { type: 'pino' },
      telemetry: { enabled: true },
    },
  },
};

export const workflowTemplates: WorkflowTemplate[] = [dataProcessingWorkflow, contentGenerationWorkflow];
