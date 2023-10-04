// packages/launch-params/vite.config.ts
import { createUMDGlobals, createViteConfig, createVitestConfig } from "file:///D:/Projects/telegram-web-apps/twa.js/packages/build-utils/dist/index.js";

// packages/launch-params/package.json
var package_default = {
  name: "@tma.js/launch-params",
  version: "0.0.0",
  description: "Utilities to work with Telegram Mini Apps launch params.",
  author: "Vladislav Kibenko <wolfram.deus@gmail.com>",
  homepage: "https://github.com/Telegram-Mini-Apps/tma.js#readme",
  repository: {
    type: "git",
    url: "git@github.com:Telegram-Mini-Apps/tma.js.git",
    directory: "packages/launch-params"
  },
  bugs: {
    url: "https://github.com/Telegram-Mini-Apps/tma.js/issues"
  },
  keywords: [
    "telegram-mini-apps",
    "typescript"
  ],
  license: "MIT",
  type: "module",
  sideEffects: false,
  files: [
    "dist",
    "src"
  ],
  main: "./dist/index.umd.cjs",
  browser: "./dist/index.umd.cjs",
  module: "./dist/index.js",
  types: "./dist/dts/index.d.ts",
  exports: {
    ".": {
      types: "./dist/dts/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.umd.cjs",
      default: "./dist/index.umd.cjs"
    }
  },
  scripts: {
    test: "vitest",
    lint: "eslint -c .eslintrc.cjs src/**/* tests/**/*",
    typecheck: "tsc --noEmit -p tsconfig.build.json",
    build: "vite build",
    rollup: "pnpm run typecheck && pnpm run build"
  },
  dependencies: {
    "@tma.js/parsing": "workspace:*",
    "@tma.js/init-data": "workspace:*",
    "@tma.js/theme-params": "workspace:*"
  },
  devDependencies: {
    tsconfig: "workspace:*",
    "eslint-config-custom": "workspace:*",
    "build-utils": "workspace:*"
  },
  publishConfig: {
    access: "public"
  }
};

// packages/launch-params/vite.config.ts
var external = ["@tma.js/parsing", "@tma.js/init-data", "@tma.js/theme-params"];
var vite_config_default = createViteConfig({
  packageName: package_default.name,
  formats: ["es", "umd"],
  external,
  globals: createUMDGlobals(external),
  test: createVitestConfig({
    environment: "happy-dom",
    coverage: {
      branches: 100,
      functions: 100,
      statements: 100,
      lines: 100
    }
  })
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbGF1bmNoLXBhcmFtcy92aXRlLmNvbmZpZy50cyIsICJwYWNrYWdlcy9sYXVuY2gtcGFyYW1zL3BhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFByb2plY3RzXFxcXHRlbGVncmFtLXdlYi1hcHBzXFxcXHR3YS5qc1xcXFxwYWNrYWdlc1xcXFxsYXVuY2gtcGFyYW1zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0ZWxlZ3JhbS13ZWItYXBwc1xcXFx0d2EuanNcXFxccGFja2FnZXNcXFxcbGF1bmNoLXBhcmFtc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvamVjdHMvdGVsZWdyYW0td2ViLWFwcHMvdHdhLmpzL3BhY2thZ2VzL2xhdW5jaC1wYXJhbXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjcmVhdGVVTURHbG9iYWxzLCBjcmVhdGVWaXRlQ29uZmlnLCBjcmVhdGVWaXRlc3RDb25maWcgfSBmcm9tICdidWlsZC11dGlscyc7XHJcblxyXG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xyXG5cclxuY29uc3QgZXh0ZXJuYWwgPSBbJ0B0bWEuanMvcGFyc2luZycsICdAdG1hLmpzL2luaXQtZGF0YScsICdAdG1hLmpzL3RoZW1lLXBhcmFtcyddO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVml0ZUNvbmZpZyh7XHJcbiAgcGFja2FnZU5hbWU6IHBhY2thZ2VKc29uLm5hbWUsXHJcbiAgZm9ybWF0czogWydlcycsICd1bWQnXSxcclxuICBleHRlcm5hbCxcclxuICBnbG9iYWxzOiBjcmVhdGVVTURHbG9iYWxzKGV4dGVybmFsKSxcclxuICB0ZXN0OiBjcmVhdGVWaXRlc3RDb25maWcoe1xyXG4gICAgZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxyXG4gICAgY292ZXJhZ2U6IHtcclxuICAgICAgYnJhbmNoZXM6IDEwMCxcclxuICAgICAgZnVuY3Rpb25zOiAxMDAsXHJcbiAgICAgIHN0YXRlbWVudHM6IDEwMCxcclxuICAgICAgbGluZXM6IDEwMCxcclxuICAgIH0sXHJcbiAgfSksXHJcbn0pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcIkB0bWEuanMvbGF1bmNoLXBhcmFtc1wiLFxyXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlV0aWxpdGllcyB0byB3b3JrIHdpdGggVGVsZWdyYW0gTWluaSBBcHBzIGxhdW5jaCBwYXJhbXMuXCIsXHJcbiAgXCJhdXRob3JcIjogXCJWbGFkaXNsYXYgS2liZW5rbyA8d29sZnJhbS5kZXVzQGdtYWlsLmNvbT5cIixcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1RlbGVncmFtLU1pbmktQXBwcy90bWEuanMjcmVhZG1lXCIsXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpUZWxlZ3JhbS1NaW5pLUFwcHMvdG1hLmpzLmdpdFwiLFxyXG4gICAgXCJkaXJlY3RvcnlcIjogXCJwYWNrYWdlcy9sYXVuY2gtcGFyYW1zXCJcclxuICB9LFxyXG4gIFwiYnVnc1wiOiB7XHJcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9UZWxlZ3JhbS1NaW5pLUFwcHMvdG1hLmpzL2lzc3Vlc1wiXHJcbiAgfSxcclxuICBcImtleXdvcmRzXCI6IFtcclxuICAgIFwidGVsZWdyYW0tbWluaS1hcHBzXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIlxyXG4gIF0sXHJcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXHJcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXHJcbiAgXCJzaWRlRWZmZWN0c1wiOiBmYWxzZSxcclxuICBcImZpbGVzXCI6IFtcclxuICAgIFwiZGlzdFwiLFxyXG4gICAgXCJzcmNcIlxyXG4gIF0sXHJcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2luZGV4LnVtZC5janNcIixcclxuICBcImJyb3dzZXJcIjogXCIuL2Rpc3QvaW5kZXgudW1kLmNqc1wiLFxyXG4gIFwibW9kdWxlXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXHJcbiAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9kdHMvaW5kZXguZC50c1wiLFxyXG4gIFwiZXhwb3J0c1wiOiB7XHJcbiAgICBcIi5cIjoge1xyXG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2R0cy9pbmRleC5kLnRzXCIsXHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXHJcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9pbmRleC51bWQuY2pzXCIsXHJcbiAgICAgIFwiZGVmYXVsdFwiOiBcIi4vZGlzdC9pbmRleC51bWQuY2pzXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcInRlc3RcIjogXCJ2aXRlc3RcIixcclxuICAgIFwibGludFwiOiBcImVzbGludCAtYyAuZXNsaW50cmMuY2pzIHNyYy8qKi8qIF9fdGVzdHNfXy8qKi8qXCIsXHJcbiAgICBcInR5cGVjaGVja1wiOiBcInRzYyAtLW5vRW1pdCAtcCB0c2NvbmZpZy5idWlsZC5qc29uXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxyXG4gICAgXCJyb2xsdXBcIjogXCJwbnBtIHJ1biB0eXBlY2hlY2sgJiYgcG5wbSBydW4gYnVpbGRcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAdG1hLmpzL3BhcnNpbmdcIjogXCJ3b3Jrc3BhY2U6KlwiLFxyXG4gICAgXCJAdG1hLmpzL2luaXQtZGF0YVwiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcIkB0bWEuanMvdGhlbWUtcGFyYW1zXCI6IFwid29ya3NwYWNlOipcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJ0c2NvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcImVzbGludC1jb25maWctY3VzdG9tXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwiYnVpbGQtdXRpbHNcIjogXCJ3b3Jrc3BhY2U6KlwiXHJcbiAgfSxcclxuICBcInB1Ymxpc2hDb25maWdcIjoge1xyXG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStXLFNBQVMsa0JBQWtCLGtCQUFrQiwwQkFBMEI7OztBQ0F0YjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsVUFBWTtBQUFBLEVBQ1osWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLElBQ1AsV0FBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLE1BQVE7QUFBQSxJQUNOLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixPQUFTO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxRQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsRUFDVCxTQUFXO0FBQUEsSUFDVCxLQUFLO0FBQUEsTUFDSCxPQUFTO0FBQUEsTUFDVCxRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxJQUNSLE1BQVE7QUFBQSxJQUNSLFdBQWE7QUFBQSxJQUNiLE9BQVM7QUFBQSxJQUNULFFBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QsbUJBQW1CO0FBQUEsSUFDbkIscUJBQXFCO0FBQUEsSUFDckIsd0JBQXdCO0FBQUEsRUFDMUI7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLFVBQVk7QUFBQSxJQUNaLHdCQUF3QjtBQUFBLElBQ3hCLGVBQWU7QUFBQSxFQUNqQjtBQUFBLEVBQ0EsZUFBaUI7QUFBQSxJQUNmLFFBQVU7QUFBQSxFQUNaO0FBQ0Y7OztBRHJEQSxJQUFNLFdBQVcsQ0FBQyxtQkFBbUIscUJBQXFCLHNCQUFzQjtBQUVoRixJQUFPLHNCQUFRLGlCQUFpQjtBQUFBLEVBQzlCLGFBQWEsZ0JBQVk7QUFBQSxFQUN6QixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsRUFDckI7QUFBQSxFQUNBLFNBQVMsaUJBQWlCLFFBQVE7QUFBQSxFQUNsQyxNQUFNLG1CQUFtQjtBQUFBLElBQ3ZCLGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFdBQVc7QUFBQSxNQUNYLFlBQVk7QUFBQSxNQUNaLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
