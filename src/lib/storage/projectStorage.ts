import type { ProjectConfig } from '../../types';

const STORAGE_KEY = 'mastra-visual-builder-project';
const AUTO_SAVE_KEY = 'mastra-visual-builder-autosave';

/**
 * Save project to localStorage
 */
export function saveProjectToLocalStorage(project: ProjectConfig): void {
  try {
    const serialized = JSON.stringify(project);
    localStorage.setItem(STORAGE_KEY, serialized);
    console.log('Project saved to localStorage');
  } catch (error) {
    console.error('Failed to save project to localStorage:', error);
    throw new Error('Failed to save project');
  }
}

/**
 * Load project from localStorage
 */
export function loadProjectFromLocalStorage(): ProjectConfig | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const project = JSON.parse(serialized) as ProjectConfig;
    console.log('Project loaded from localStorage');
    return project;
  } catch (error) {
    console.error('Failed to load project from localStorage:', error);
    return null;
  }
}

/**
 * Save project to file (JSON)
 */
export async function saveProjectToFile(project: ProjectConfig, filename?: string): Promise<void> {
  try {
    const serialized = JSON.stringify(project, null, 2);
    const blob = new Blob([serialized], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${project.settings?.projectName || 'mastra-project'}.mastra.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Project saved to file');
  } catch (error) {
    console.error('Failed to save project to file:', error);
    throw new Error('Failed to save project to file');
  }
}

/**
 * Load project from file
 */
export async function loadProjectFromFile(file: File): Promise<ProjectConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const project = JSON.parse(content) as ProjectConfig;
        console.log('Project loaded from file');
        resolve(project);
      } catch (error) {
        console.error('Failed to parse project file:', error);
        reject(new Error('Invalid project file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Auto-save project
 */
export function autoSaveProject(project: ProjectConfig): void {
  try {
    const serialized = JSON.stringify(project);
    localStorage.setItem(AUTO_SAVE_KEY, serialized);
  } catch (error) {
    console.error('Failed to auto-save project:', error);
  }
}

/**
 * Load auto-saved project
 */
export function loadAutoSavedProject(): ProjectConfig | null {
  try {
    const serialized = localStorage.getItem(AUTO_SAVE_KEY);
    if (!serialized) return null;

    return JSON.parse(serialized) as ProjectConfig;
  } catch (error) {
    console.error('Failed to load auto-saved project:', error);
    return null;
  }
}

/**
 * Clear auto-save
 */
export function clearAutoSave(): void {
  localStorage.removeItem(AUTO_SAVE_KEY);
}

/**
 * Clear saved project
 */
export function clearSavedProject(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if there's a saved project
 */
export function hasSavedProject(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Check if there's an auto-saved project
 */
export function hasAutoSavedProject(): boolean {
  return localStorage.getItem(AUTO_SAVE_KEY) !== null;
}
