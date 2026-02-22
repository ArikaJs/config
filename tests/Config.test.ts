
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Repository, EnvLoader, env, config, setConfigRepository } from '../src';

describe('Config Package', () => {
    it('can get and set values in repository', () => {
        const repo = new Repository({
            app: { name: 'Arika' }
        });

        assert.strictEqual(repo.get('app.name'), 'Arika');
        repo.set('app.env', 'test');
        assert.strictEqual(repo.get('app.env'), 'test');
    });

    it('returns default value if key not found', () => {
        const repo = new Repository();
        assert.strictEqual(repo.get('non.existent', 'default'), 'default');
    });

    it('can mark as booted and prevent modifications', () => {
        const repo = new Repository();
        repo.markAsBooted();
        assert.throws(() => repo.set('any', 'value'), /Configuration cannot be modified after boot/);
    });

    it('handles environment variables with casting', () => {
        process.env.TEST_TRUE = 'true';
        process.env.TEST_FALSE = 'false';
        process.env.TEST_NULL = 'null';
        process.env.TEST_STR = 'hello';

        assert.strictEqual(EnvLoader.get('TEST_TRUE'), true);
        assert.strictEqual(EnvLoader.get('TEST_FALSE'), false);
        assert.strictEqual(EnvLoader.get('TEST_NULL'), null);
        assert.strictEqual(EnvLoader.get('TEST_STR'), 'hello');
        assert.strictEqual(EnvLoader.get('NON_EXISTENT', 'fallback'), 'fallback');
    });

    it('works with global helpers', () => {
        const repo = new Repository({ site: { url: 'https://arika.js' } });
        setConfigRepository(repo);

        assert.strictEqual(config('site.url'), 'https://arika.js');
        assert.strictEqual(env('TEST_STR'), 'hello');
    });
});
