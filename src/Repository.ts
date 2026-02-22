
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

const localRequire = createRequire(import.meta.url);

export class Repository {
    private config: Record<string, any> = {};
    private booted = false;

    constructor(initialConfig: Record<string, any> = {}) {
        this.config = { ...initialConfig };
    }

    /**
     * Load configuration files from the config directory.
     */
    public loadConfigDirectory(configPath: string): void {
        if (this.booted) {
            throw new Error('Configuration cannot be modified after boot.');
        }

        if (!fs.existsSync(configPath)) {
            return;
        }

        const files = fs.readdirSync(configPath);
        const configFiles = files.filter(
            (file: string) => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.cjs') || file.endsWith('.mjs'),
        );

        for (const file of configFiles) {
            const filePath = path.join(configPath, file);
            const configName = path.basename(file, path.extname(file));

            try {
                // In ESM environment, we might need dynamic import for some files
                // but require works for most compiled JS.
                let configValue;
                if (file.endsWith('.mjs') || file.endsWith('.js')) {
                    // Try dynamic import for ESM
                    // Note: This is simplified. In a real scenario, you might need to handle this async.
                    // For now, we'll try localRequire and fallback.
                    try {
                        const module = localRequire(filePath);
                        configValue = module.default || module;
                    } catch {
                        // If it's a pure ESM file, this might fail in some node versions
                    }
                } else {
                    const module = localRequire(filePath);
                    configValue = module.default || module;
                }

                if (typeof configValue === 'object' && configValue !== null) {
                    this.config[configName] = { ...this.config[configName], ...configValue };
                }
            } catch (error) {
                // Silently skip files that can't be loaded
            }
        }
    }

    /**
     * Get a configuration value using dot notation.
     */
    public get<T = any>(key: string, defaultValue?: T): T {
        const keys = key.split('.');
        let value: any = this.config;

        for (const k of keys) {
            if (value === undefined || value === null) {
                return defaultValue as T;
            }
            value = value[k];
        }

        return value !== undefined ? (value as T) : (defaultValue as T);
    }

    /**
     * Check if a configuration key exists.
     */
    public has(key: string): boolean {
        return this.get(key) !== undefined;
    }

    /**
     * Set a configuration value using dot notation.
     */
    public set(key: string, value: any): void {
        if (this.booted) {
            throw new Error('Configuration cannot be modified after boot.');
        }

        const keys = key.split('.');
        let current = this.config;

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in current) || typeof current[k] !== 'object' || current[k] === null) {
                current[k] = {};
            }
            current = current[k];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Get all configuration.
     */
    public all(): Record<string, any> {
        return { ...this.config };
    }

    /**
     * Mark the repository as booted (read-only).
     */
    public markAsBooted(): void {
        this.booted = true;
    }

    /**
     * Check if the repository has been booted.
     */
    public isBooted(): boolean {
        return this.booted;
    }
}
