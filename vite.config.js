import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/ecowatt/',
  test: {
    include: ['tests/**/*.test.js'],
    reporters: ['default', 'junit', 'json'],
    outputFile: { junit: 'test-results/unit.xml', json: 'test-results/unit.json' }
  }
});
