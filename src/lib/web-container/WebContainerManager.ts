import { WebContainer, type FileSystemTree } from '@webcontainer/api';

export type LogCallback = (message: string, level: 'info' | 'warning' | 'error') => void;
export type StatusCallback = (status: 'booting' | 'installing' | 'starting' | 'running' | 'error') => void;

/**
 * Manages WebContainer lifecycle and operations
 * Implements singleton pattern for efficient resource usage
 */
export class WebContainerManager {
  private static instance: WebContainer | null = null;
  private static isBooting = false;
  private serverUrl: string | null = null;
  private devProcess: any = null;

  /**
   * Boot WebContainer instance (singleton)
   */
  async boot(onLog?: LogCallback): Promise<WebContainer> {
    // Return existing instance if already booted
    if (WebContainerManager.instance) {
      onLog?.('WebContainer already running, reusing instance', 'info');
      return WebContainerManager.instance;
    }

    // Wait if currently booting
    if (WebContainerManager.isBooting) {
      onLog?.('WebContainer is booting, please wait...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.boot(onLog);
    }

    try {
      WebContainerManager.isBooting = true;
      onLog?.('Booting WebContainer...', 'info');

      WebContainerManager.instance = await WebContainer.boot({
        coep: 'require-corp',
        workdirName: 'mastra-project',
      });

      onLog?.('WebContainer booted successfully', 'info');
      return WebContainerManager.instance;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      onLog?.(`Failed to boot WebContainer: ${errorMsg}`, 'error');
      onLog?.(
        'Please ensure your browser supports WebContainers (Chrome, Edge, or recent Firefox)',
        'error',
      );
      throw error;
    } finally {
      WebContainerManager.isBooting = false;
    }
  }

  /**
   * Mount project files to WebContainer filesystem
   */
  async mountProject(files: FileSystemTree, onLog?: LogCallback): Promise<void> {
    const container = await this.boot(onLog);

    try {
      onLog?.('Mounting project files...', 'info');
      await container.mount(files);
      onLog?.('Project files mounted successfully', 'info');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      onLog?.(`Failed to mount files: ${errorMsg}`, 'error');
      throw error;
    }
  }

  /**
   * Install dependencies via npm install
   */
  async installDependencies(onLog?: LogCallback): Promise<void> {
    const container = await this.boot(onLog);

    try {
      onLog?.('Installing dependencies...', 'info');
      onLog?.('Running: npm install', 'info');

      const installProcess = await container.spawn('npm', ['install']);

      // Stream output
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            const message = data.trim();
            if (message) {
              onLog?.(message, 'info');
            }
          },
        }),
      );

      const exitCode = await installProcess.exit;

      if (exitCode !== 0) {
        onLog?.(`npm install failed with exit code ${exitCode}`, 'error');
        throw new Error(`npm install failed with exit code ${exitCode}`);
      }

      onLog?.('Dependencies installed successfully', 'info');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      onLog?.(`Installation failed: ${errorMsg}`, 'error');
      throw error;
    }
  }

  /**
   * Start Mastra dev server
   */
  async startDevServer(onLog?: LogCallback, onStatus?: StatusCallback): Promise<string> {
    const container = await this.boot(onLog);

    try {
      onLog?.('Starting Mastra dev server...', 'info');
      onLog?.('Running: npm run dev', 'info');
      onStatus?.('starting');

      // Listen for server ready event
      const serverReadyPromise = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server startup timeout (2 minutes)'));
        }, 120000); // 2 minutes timeout

        container.on('server-ready', (port, url) => {
          clearTimeout(timeout);
          this.serverUrl = url;
          onLog?.(`Server ready on port ${port}: ${url}`, 'info');
          onStatus?.('running');
          resolve(url);
        });
      });

      // Start dev process
      this.devProcess = await container.spawn('npm', ['run', 'dev']);

      // Stream output
      this.devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            const message = data.trim();
            if (message) {
              // Detect error patterns
              if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
                onLog?.(message, 'error');
              } else if (message.toLowerCase().includes('warn')) {
                onLog?.(message, 'warning');
              } else {
                onLog?.(message, 'info');
              }
            }
          },
        }),
      );

      // Wait for server to be ready
      const url = await serverReadyPromise;
      return url;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      onLog?.(`Failed to start dev server: ${errorMsg}`, 'error');
      onStatus?.('error');
      throw error;
    }
  }

  /**
   * Get current server URL
   */
  getServerUrl(): string | null {
    return this.serverUrl;
  }

  /**
   * Stop the dev server process
   */
  async stopDevServer(onLog?: LogCallback): Promise<void> {
    if (this.devProcess) {
      try {
        onLog?.('Stopping dev server...', 'info');
        this.devProcess.kill();
        this.devProcess = null;
        this.serverUrl = null;
        onLog?.('Dev server stopped', 'info');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        onLog?.(`Failed to stop dev server: ${errorMsg}`, 'warning');
      }
    }
  }

  /**
   * Destroy WebContainer instance (cleanup)
   */
  async destroy(onLog?: LogCallback): Promise<void> {
    await this.stopDevServer(onLog);

    if (WebContainerManager.instance) {
      try {
        onLog?.('Destroying WebContainer instance...', 'info');
        await WebContainerManager.instance.teardown();
        WebContainerManager.instance = null;
        this.serverUrl = null;
        onLog?.('WebContainer destroyed', 'info');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        onLog?.(`Failed to destroy WebContainer: ${errorMsg}`, 'warning');
      }
    }
  }

  /**
   * Check if WebContainer is running
   */
  isRunning(): boolean {
    return WebContainerManager.instance !== null;
  }

  /**
   * Check if dev server is running
   */
  isServerRunning(): boolean {
    return this.serverUrl !== null;
  }
}

