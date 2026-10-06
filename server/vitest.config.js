import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.js'],
        // JWT_SECRET is a fixed test value — never reads real secrets.
        // MONGODB_URI: integration tests need a real MongoDB. Uses the
        // host env if set (CI), else local Docker mongo. Start it with:
        //   docker run -d --rm -p 27017:27017 mongo:7
        env: {
            MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/studyswap-test',
            JWT_SECRET: 'test-secret',
            PORT: '0',
        },
        // Each test file runs sequentially — suites share one MongoDB and
        // parallel workers were clobbering each other's fixtures (flaky
        // 401s from mid-run user deletion). Sequence is still fast (~4s).
        fileParallelism: false,
    },
});
