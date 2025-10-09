import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileItem {
  path: string;
  content: string;
  type: 'file';
  name: string;
}

interface FolderItem {
  name: string;
  children: (FileItem | FolderItem)[];
  type: 'folder';
}

interface CodeFile {
  path: string;
  content: string;
}

interface FileExplorerProps {
  files: CodeFile[];
  selectedFile: string;
  onSelectFile: (path: string) => void;
}

export function FileExplorer({ files, selectedFile, onSelectFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'agents', 'workflows', 'tools', 'steps']),
  );

  // Convert flat file list to tree structure
  const buildFileTree = (files: CodeFile[]): (FileItem | FolderItem)[] => {
    const tree: { [key: string]: any } = {};

    files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // This is a file
          current[part] = { ...file, type: 'file', name: part };
        } else {
          // This is a folder
          if (!current[part]) {
            current[part] = { type: 'folder', name: part, children: {} };
          }
          current = current[part].children;
        }
      });
    });

    // Convert to array format
    const convertToArray = (obj: any): (FileItem | FolderItem)[] => {
      return Object.values(obj).map((item: any) => {
        if (item.type === 'folder') {
          return {
            type: 'folder',
            name: item.name,
            children: convertToArray(item.children),
          };
        }
        return item;
      });
    };

    return convertToArray(tree);
  };

  const fileTree = buildFileTree(files);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = () => {
    return <File className="h-3 w-3 text-muted-foreground" />;
  };

  const renderTreeItem = (item: FileItem | FolderItem, depth = 0, path = ''): React.ReactNode => {
    const fullPath = path ? `${path}/${item.name}` : item.name;

    if (item.type === 'folder') {
      const isExpanded = expandedFolders.has(fullPath);
      const hasChildren = item.children.length > 0;

      return (
        <div key={fullPath}>
          <button
            onClick={() => toggleFolder(fullPath)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent w-full text-left',
              depth > 0 && 'ml-4',
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )
            ) : (
              <div className="w-3" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-3 w-3 text-blue-400" />
            ) : (
              <Folder className="h-3 w-3 text-blue-400" />
            )}
            <span className="text-foreground">{item.name}</span>
          </button>
          {isExpanded && item.children.map(child => renderTreeItem(child, depth + 1, fullPath))}
        </div>
      );
    } else {
      const isSelected = selectedFile === item.path;
      const fileName = item.path.split('/').pop() || item.path;

      return (
        <button
          key={item.path}
          onClick={() => onSelectFile(item.path)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent w-full text-left',
            isSelected && 'bg-primary/10 text-primary',
            depth > 0 && 'ml-4',
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className="w-3" />
          {getFileIcon()}
          <span className={cn('truncate text-foreground', isSelected && 'font-medium')}>{fileName}</span>
        </button>
      );
    }
  };

  return (
    <div className="w-64 border-r border-border bg-secondary/20 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Generated Files</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.length === 0 ? (
          <div className="text-xs text-muted-foreground p-2">No files generated</div>
        ) : (
          fileTree.map(item => renderTreeItem(item))
        )}
      </div>
    </div>
  );
}
