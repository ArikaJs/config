
## Arika Config

`@arikajs/config` is a powerful, lightweight, and framework-agnostic configuration management library for Node.js.

It provides a unified way to manage environment variables and application configurations using fluent dot-notation access, type safety, and automatic environment loading.

---

## ✨ Features

- **🎯 Dot-notation access**: Access nested configurations easily (e.g., `app.name`)
- **🌍 Environment Integration**: Built-in support for `.env` files with intelligent type casting
- **🛡️ Type Safety**: Guaranteed types for configuration values with defaults
- **📦 Immutable by Default**: Mark configurations as read-only once the application boots
- **🔌 Highly Extensible**: Easily load configurations from directories or custom sources
- **🟦 TypeScript-first**: Full type safety and intellisense out of the box

---

## 📦 Installation

```bash
npm install @arikajs/config
```

---

## 🚀 Quick Start

### 1️⃣ Basic Usage

```ts
import { Repository } from '@arikajs/config';

const config = new Repository({
    app: {
        name: 'ArikaJS',
        env: 'production'
    },
    database: {
        connection: 'mysql'
    }
});

// Access values using dot-notation
const appName = config.get('app.name'); // 'ArikaJS'
const dbConn = config.get('database.connection', 'sqlite'); // 'mysql'
```

### 2️⃣ Environment Variables

```ts
import { env } from '@arikajs/config';

// Automatically casts 'true'/'false' strings to booleans
const debug = env('APP_DEBUG', false); 

// Automatically casts 'null' string to null type
const key = env('APP_KEY');
```

---

## 📅 Advanced Usage

### Loading from a Directory
Perfect for organizing large applications:

```ts
const config = new Repository();
config.loadConfigDirectory(path.join(__dirname, 'config'));
```

### Immutable Configuration
Prevent accidental runtime changes to your settings:

```ts
config.markAsBooted();

config.set('app.name', 'New Name'); // Throws Error
```

### Global Helpers
Access configuration anywhere without passing the repository around:

```ts
import { config, env } from '@arikajs/config';

// After initializing your repository
const timezone = config('app.timezone', 'UTC');
```

---

## 🏗 Architecture

```
config/
├── src/
│   ├── Repository.ts   # The main configuration store
│   ├── EnvLoader.ts    # Logic for .env processing
│   ├── helpers.ts      # Global config() and env() functions
│   └── index.ts        # Public API
├── tests/              # Unit tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License

`@arikajs/config` is open-source software licensed under the **MIT License**.

---

## 🧭 Philosophy

> "Configuration should be simple to define and impossible to break."
