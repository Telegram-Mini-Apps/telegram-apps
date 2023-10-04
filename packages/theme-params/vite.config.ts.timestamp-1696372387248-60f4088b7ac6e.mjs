// packages/theme-params/vite.config.ts
import { createUMDGlobals, createViteConfig, createVitestConfig } from "file:///D:/Projects/telegram-web-apps/twa.js/packages/build-utils/dist/index.js";

// packages/theme-params/package.json
var package_default = {
  name: "@tma.js/theme-params",
  version: "0.0.0",
  description: "Utilities to work with Telegram Mini Apps theme parameters.",
  author: "Vladislav Kibenko <wolfram.deus@gmail.com>",
  homepage: "https://github.com/Telegram-Mini-Apps/tma.js#readme",
  repository: {
    type: "git",
    url: "git@github.com:Telegram-Mini-Apps/tma.js.git",
    directory: "packages/theme-params"
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
    lint: "eslint -c .eslintrc.cjs src/**/* __tests__/**/*",
    typecheck: "tsc --noEmit -p tsconfig.build.json",
    build: "vite build",
    rollup: "pnpm run typecheck && pnpm run build"
  },
  dependencies: {
    "@tma.js/colors": "workspace:*",
    "@tma.js/parsing": "workspace:*"
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

// packages/theme-params/vite.config.ts
var external = ["@tma.js/parsing", "@tma.js/colors"];
var vite_config_default = createViteConfig({
  packageName: package_default.name,
  formats: ["es", "umd"],
  external,
  globals: createUMDGlobals(external),
  test: createVitestConfig({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvdGhlbWUtcGFyYW1zL3ZpdGUuY29uZmlnLnRzIiwgInBhY2thZ2VzL3RoZW1lLXBhcmFtcy9wYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0ZWxlZ3JhbS13ZWItYXBwc1xcXFx0d2EuanNcXFxccGFja2FnZXNcXFxcdGhlbWUtcGFyYW1zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0ZWxlZ3JhbS13ZWItYXBwc1xcXFx0d2EuanNcXFxccGFja2FnZXNcXFxcdGhlbWUtcGFyYW1zXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy90ZWxlZ3JhbS13ZWItYXBwcy90d2EuanMvcGFja2FnZXMvdGhlbWUtcGFyYW1zL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgY3JlYXRlVU1ER2xvYmFscywgY3JlYXRlVml0ZUNvbmZpZywgY3JlYXRlVml0ZXN0Q29uZmlnIH0gZnJvbSAnYnVpbGQtdXRpbHMnO1xyXG5cclxuaW1wb3J0IHBhY2thZ2VKc29uIGZyb20gJy4vcGFja2FnZS5qc29uJztcclxuXHJcbmNvbnN0IGV4dGVybmFsID0gWydAdG1hLmpzL3BhcnNpbmcnLCAnQHRtYS5qcy9jb2xvcnMnXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVZpdGVDb25maWcoe1xyXG4gIHBhY2thZ2VOYW1lOiBwYWNrYWdlSnNvbi5uYW1lLFxyXG4gIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXHJcbiAgZXh0ZXJuYWwsXHJcbiAgZ2xvYmFsczogY3JlYXRlVU1ER2xvYmFscyhleHRlcm5hbCksXHJcbiAgdGVzdDogY3JlYXRlVml0ZXN0Q29uZmlnKHtcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIGJyYW5jaGVzOiAxMDAsXHJcbiAgICAgIGZ1bmN0aW9uczogMTAwLFxyXG4gICAgICBzdGF0ZW1lbnRzOiAxMDAsXHJcbiAgICAgIGxpbmVzOiAxMDAsXHJcbiAgICB9LFxyXG4gIH0pLFxyXG59KTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJAdG1hLmpzL3RoZW1lLXBhcmFtc1wiLFxyXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlV0aWxpdGllcyB0byB3b3JrIHdpdGggVGVsZWdyYW0gTWluaSBBcHBzIHRoZW1lIHBhcmFtZXRlcnMuXCIsXHJcbiAgXCJhdXRob3JcIjogXCJWbGFkaXNsYXYgS2liZW5rbyA8d29sZnJhbS5kZXVzQGdtYWlsLmNvbT5cIixcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1RlbGVncmFtLU1pbmktQXBwcy90bWEuanMjcmVhZG1lXCIsXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpUZWxlZ3JhbS1NaW5pLUFwcHMvdG1hLmpzLmdpdFwiLFxyXG4gICAgXCJkaXJlY3RvcnlcIjogXCJwYWNrYWdlcy90aGVtZS1wYXJhbXNcIlxyXG4gIH0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1RlbGVncmFtLU1pbmktQXBwcy90bWEuanMvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwia2V5d29yZHNcIjogW1xyXG4gICAgXCJ0ZWxlZ3JhbS1taW5pLWFwcHNcIixcclxuICAgIFwidHlwZXNjcmlwdFwiXHJcbiAgXSxcclxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcInNpZGVFZmZlY3RzXCI6IGZhbHNlLFxyXG4gIFwiZmlsZXNcIjogW1xyXG4gICAgXCJkaXN0XCIsXHJcbiAgICBcInNyY1wiXHJcbiAgXSxcclxuICBcIm1haW5cIjogXCIuL2Rpc3QvaW5kZXgudW1kLmNqc1wiLFxyXG4gIFwiYnJvd3NlclwiOiBcIi4vZGlzdC9pbmRleC51bWQuY2pzXCIsXHJcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcclxuICBcInR5cGVzXCI6IFwiLi9kaXN0L2R0cy9pbmRleC5kLnRzXCIsXHJcbiAgXCJleHBvcnRzXCI6IHtcclxuICAgIFwiLlwiOiB7XHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvZHRzL2luZGV4LmQudHNcIixcclxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcclxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2luZGV4LnVtZC5janNcIixcclxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9kaXN0L2luZGV4LnVtZC5janNcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwidGVzdFwiOiBcInZpdGVzdFwiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC1jIC5lc2xpbnRyYy5janMgc3JjLyoqLyogX190ZXN0c19fLyoqLypcIixcclxuICAgIFwidHlwZWNoZWNrXCI6IFwidHNjIC0tbm9FbWl0IC1wIHRzY29uZmlnLmJ1aWxkLmpzb25cIixcclxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInJvbGx1cFwiOiBcInBucG0gcnVuIHR5cGVjaGVjayAmJiBwbnBtIHJ1biBidWlsZFwiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkB0bWEuanMvY29sb3JzXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwiQHRtYS5qcy9wYXJzaW5nXCI6IFwid29ya3NwYWNlOipcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJ0c2NvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcImVzbGludC1jb25maWctY3VzdG9tXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwiYnVpbGQtdXRpbHNcIjogXCJ3b3Jrc3BhY2U6KlwiXHJcbiAgfSxcclxuICBcInB1Ymxpc2hDb25maWdcIjoge1xyXG4gICAgXCJhY2Nlc3NcIjogXCJwdWJsaWNcIlxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLFNBQVMsa0JBQWtCLGtCQUFrQiwwQkFBMEI7OztBQ0FuYjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsVUFBWTtBQUFBLEVBQ1osWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLElBQ1AsV0FBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLE1BQVE7QUFBQSxJQUNOLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixPQUFTO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxRQUFVO0FBQUEsRUFDVixPQUFTO0FBQUEsRUFDVCxTQUFXO0FBQUEsSUFDVCxLQUFLO0FBQUEsTUFDSCxPQUFTO0FBQUEsTUFDVCxRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxJQUNSLE1BQVE7QUFBQSxJQUNSLFdBQWE7QUFBQSxJQUNiLE9BQVM7QUFBQSxJQUNULFFBQVU7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2Qsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLFVBQVk7QUFBQSxJQUNaLHdCQUF3QjtBQUFBLElBQ3hCLGVBQWU7QUFBQSxFQUNqQjtBQUFBLEVBQ0EsZUFBaUI7QUFBQSxJQUNmLFFBQVU7QUFBQSxFQUNaO0FBQ0Y7OztBRHBEQSxJQUFNLFdBQVcsQ0FBQyxtQkFBbUIsZ0JBQWdCO0FBRXJELElBQU8sc0JBQVEsaUJBQWlCO0FBQUEsRUFDOUIsYUFBYSxnQkFBWTtBQUFBLEVBQ3pCLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsU0FBUyxpQkFBaUIsUUFBUTtBQUFBLEVBQ2xDLE1BQU0sbUJBQW1CO0FBQUEsSUFDdkIsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsV0FBVztBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
