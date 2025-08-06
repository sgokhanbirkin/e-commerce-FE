import type { FederationModule, RemoteModule } from './federation';

// Dynamic import utility for remote components
export async function loadRemoteComponent<T = any>(
  remoteName: string,
  moduleName: string
): Promise<T> {
  try {
    // Check if the remote is available
    if (!(window as any).__FEDERATION__) {
      throw new Error('Module Federation not initialized');
    }

    const container = (window as any).__FEDERATION__[remoteName];
    if (!container) {
      throw new Error(`Remote ${remoteName} not found`);
    }

    // Get the module
    const module = await container.get(moduleName);
    if (!module) {
      throw new Error(`Module ${moduleName} not found in remote ${remoteName}`);
    }

    return module.default || module;
  } catch (error) {
    console.error(
      `Failed to load remote component: ${remoteName}/${moduleName}`,
      error
    );
    throw error;
  }
}

// Preload remote components
export function preloadRemoteComponent(
  remoteName: string,
  moduleName: string
): void {
  try {
    const container = (window as any).__FEDERATION__?.[remoteName];
    if (container) {
      container.get(moduleName);
    }
  } catch (error) {
    console.warn(
      `Failed to preload remote component: ${remoteName}/${moduleName}`,
      error
    );
  }
}

// Check if remote is available
export function isRemoteAvailable(remoteName: string): boolean {
  return !!(window as any).__FEDERATION__?.[remoteName];
}

// Get remote container
export function getRemoteContainer(remoteName: string) {
  return (window as any).__FEDERATION__?.[remoteName];
}
