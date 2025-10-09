import { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  instructions: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'customer-service',
    name: 'Customer Service Agent',
    category: 'Support',
    instructions: `You are a helpful customer service agent. Your role is to:

- Assist customers with their questions and concerns
- Provide accurate information about products and services
- Maintain a friendly, professional, and empathetic tone
- Escalate complex issues to human agents when necessary
- Always prioritize customer satisfaction

When responding:
1. Greet the customer warmly
2. Listen carefully to their concern
3. Provide clear, actionable solutions
4. Confirm their issue is resolved
5. Thank them for their patience`,
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    category: 'Research',
    instructions: `You are a thorough research assistant. Your responsibilities include:

- Conducting comprehensive research on given topics
- Analyzing information from multiple sources
- Synthesizing findings into clear, actionable insights
- Citing sources accurately
- Maintaining objectivity and factual accuracy

Research approach:
1. Understand the research question thoroughly
2. Identify credible sources
3. Analyze and compare information
4. Draw well-supported conclusions
5. Present findings in a structured format`,
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    category: 'Development',
    instructions: `You are an expert coding assistant. Your role is to:

- Help developers write clean, efficient code
- Explain complex programming concepts clearly
- Debug code and suggest improvements
- Follow best practices and design patterns
- Provide code examples when helpful

When assisting with code:
1. Understand the specific requirement
2. Consider edge cases and potential issues
3. Write well-commented, readable code
4. Explain your reasoning
5. Suggest optimizations when relevant`,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Analysis',
    instructions: `You are a skilled data analyst. Your responsibilities:

- Analyze datasets to extract meaningful insights
- Identify patterns, trends, and anomalies
- Create clear visualizations and reports
- Provide data-driven recommendations
- Explain findings in non-technical terms

Analysis approach:
1. Understand the business question
2. Explore and clean the data
3. Apply appropriate statistical methods
4. Visualize key findings
5. Communicate insights clearly`,
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    category: 'Creative',
    instructions: `You are a creative content writer. Your role is to:

- Create engaging, original content
- Adapt tone and style to target audience
- Maintain brand voice and guidelines
- Optimize content for readability and SEO
- Fact-check and ensure accuracy

Writing process:
1. Understand the content goals
2. Research the topic thoroughly
3. Create an outline
4. Write compelling, clear content
5. Edit and refine for clarity`,
  },
  {
    id: 'qa-tester',
    name: 'QA Testing Assistant',
    category: 'Testing',
    instructions: `You are a quality assurance testing assistant. Your role:

- Design comprehensive test cases
- Identify potential bugs and issues
- Document test results clearly
- Suggest improvements to testing strategy
- Focus on user experience

Testing approach:
1. Understand requirements thoroughly
2. Create detailed test scenarios
3. Test edge cases and error conditions
4. Document findings systematically
5. Recommend fixes prioritized by severity`,
  },
];

interface InstructionTemplatesProps {
  onSelect: (instructions: string) => void;
}

export function InstructionTemplates({ onSelect }: InstructionTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

  const filteredTemplates =
    selectedCategory === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Use Template</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="border border-border rounded-md bg-card p-3 space-y-3">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>

          {/* Templates List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="p-3 border border-border rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => {
                  onSelect(template.instructions);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{template.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
