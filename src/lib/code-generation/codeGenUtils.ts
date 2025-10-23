/**
 * Shared utilities for code generation
 */

/**
 * Escape string for use in single-quoted strings
 * Handles all special characters that could break string literals or enable injection
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Backslash must be first
    .replace(/'/g, "\\'")     // Single quote
    .replace(/"/g, '\\"')     // Double quote
    .replace(/`/g, '\\`')     // Backtick (template literal)
    .replace(/\$/g, '\\$')    // Dollar sign (template literal expression)
    .replace(/\n/g, '\\n')    // Newline
    .replace(/\r/g, '\\r')    // Carriage return
    .replace(/\t/g, '\\t')    // Tab
    .replace(/\0/g, '\\0');   // Null character
}

/**
 * Escape backticks and template literal expressions for use in template literals
 */
export function escapeBackticks(str: string): string {
  return str
    .replace(/\\/g, '\\\\')   // Backslash must be first
    .replace(/`/g, '\\`')     // Backtick
    .replace(/\${/g, '\\${'); // Template expression
}

/**
 * Convert kebab-case or snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_]([a-z])/g, (_match, letter) => letter.toUpperCase())
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
}

/**
 * Validate that user-provided execute code is safe (basic check)
 * This performs basic syntax validation but is NOT a complete security solution
 * For production, consider using a proper AST parser like acorn or @babel/parser
 * 
 * @param code - The code to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateExecuteCode(code: string): { isValid: boolean; error?: string } {
  if (!code || code.trim() === '') {
    return { isValid: false, error: 'Execute code cannot be empty' };
  }

  // Check for dangerous patterns (basic protection)
  const dangerousPatterns = [
    /process\.env/i,              // Direct environment access
    /require\s*\(/,               // CommonJS require
    /import\s+.*\s+from/,         // ES6 imports (should be in generator)
    /eval\s*\(/,                  // eval() calls
    /Function\s*\(/,              // Function constructor
    /setTimeout|setInterval/i,    // Timers (potential DoS)
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return { 
        isValid: false, 
        error: `Code contains potentially dangerous pattern: ${pattern.source}` 
      };
    }
  }

  // Check if code looks like a function (should start with async or function keyword, or be arrow function)
  const functionPatterns = [
    /^\s*async\s+function/,           // async function
    /^\s*function/,                    // function
    /^\s*async\s*\([^)]*\)\s*=>/,     // async arrow function
    /^\s*\([^)]*\)\s*=>/,              // arrow function
  ];

  const looksLikeFunction = functionPatterns.some(pattern => pattern.test(code));
  
  if (!looksLikeFunction) {
    return { 
      isValid: false, 
      error: 'Execute code must be a valid function (async function, function, or arrow function)' 
    };
  }

  // Try to parse as JavaScript (basic syntax check)
  try {
    // Wrap in eval to check syntax without executing
    new Function(`"use strict"; return (${code});`);
  } catch (error) {
    return { 
      isValid: false, 
      error: `Invalid JavaScript syntax: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }

  return { isValid: true };
}

/**
 * Sanitize user-provided code by removing comments and normalizing whitespace
 * This is a basic sanitization - for production use, implement proper AST-based validation
 */
export function sanitizeCode(code: string): string {
  return code
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

