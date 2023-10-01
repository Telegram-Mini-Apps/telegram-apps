// packages/sdk-solid/vite.config.ts
import { createUMDGlobals, createViteConfig } from "file:///D:/Projects/telegram-web-apps/twa.js/packages/build-utils/dist/index.js";

// packages/sdk-solid/package.json
var package_default = {
  name: "@tma.js/sdk-solid",
  version: "0.1.5",
  description: "Solid JS bindings for Web Apps client SDK.",
  author: "Vladislav Kibenko <wolfram.deus@gmail.com>",
  homepage: "https://github.com/Telegram-Mini-Apps/tma.js#readme",
  repository: {
    type: "git",
    url: "git@github.com:Telegram-Mini-Apps/tma.js.git",
    directory: "packages/sdk-solid"
  },
  bugs: {
    url: "https://github.com/Telegram-Mini-Apps/tma.js/issues"
  },
  keywords: [
    "telegram-mini-apps",
    "typescript",
    "sdk",
    "solidjs"
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
    lint: "eslint -c .eslintrc.cjs src/**/*",
    build: "vite build"
  },
  dependencies: {
    "@tma.js/utils": "workspace:*",
    "@tma.js/sdk": "workspace:*"
  },
  peerDependencies: {
    "solid-js": "^1.0.0"
  },
  devDependencies: {
    "eslint-config-custom": "workspace:*",
    tsconfig: "workspace:*",
    "build-utils": "workspace:*"
  },
  publishConfig: {
    access: "public"
  }
};

// packages/sdk-solid/vite.config.ts
import solidPlugin from "file:///D:/Projects/telegram-web-apps/twa.js/node_modules/.pnpm/vite-plugin-solid@2.7.0_solid-js@1.7.6_vite@4.4.9/node_modules/vite-plugin-solid/dist/esm/index.mjs";
var external = ["@tma.js/utils", "@tma.js/sdk", "solid-js"];
var vite_config_default = createViteConfig({
  packageName: package_default.name,
  formats: ["es", "umd"],
  external,
  globals: createUMDGlobals(external),
  plugins: [solidPlugin()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvc2RrLXNvbGlkL3ZpdGUuY29uZmlnLnRzIiwgInBhY2thZ2VzL3Nkay1zb2xpZC9wYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0ZWxlZ3JhbS13ZWItYXBwc1xcXFx0d2EuanNcXFxccGFja2FnZXNcXFxcc2RrLXNvbGlkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFx0ZWxlZ3JhbS13ZWItYXBwc1xcXFx0d2EuanNcXFxccGFja2FnZXNcXFxcc2RrLXNvbGlkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy90ZWxlZ3JhbS13ZWItYXBwcy90d2EuanMvcGFja2FnZXMvc2RrLXNvbGlkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgY3JlYXRlVU1ER2xvYmFscywgY3JlYXRlVml0ZUNvbmZpZyB9IGZyb20gJ2J1aWxkLXV0aWxzJztcclxuXHJcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbic7XHJcbmltcG9ydCBzb2xpZFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1zb2xpZCc7XHJcblxyXG5jb25zdCBleHRlcm5hbCA9IFsnQHRtYS5qcy91dGlscycsICdAdG1hLmpzL3NkaycsICdzb2xpZC1qcyddO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVml0ZUNvbmZpZyh7XHJcbiAgcGFja2FnZU5hbWU6IHBhY2thZ2VKc29uLm5hbWUsXHJcbiAgZm9ybWF0czogWydlcycsICd1bWQnXSxcclxuICBleHRlcm5hbCxcclxuICBnbG9iYWxzOiBjcmVhdGVVTURHbG9iYWxzKGV4dGVybmFsKSxcclxuICBwbHVnaW5zOiBbc29saWRQbHVnaW4oKV0sXHJcbn0pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcIkB0bWEuanMvc2RrLXNvbGlkXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4xLjVcIixcclxuICBcImRlc2NyaXB0aW9uXCI6IFwiU29saWQgSlMgYmluZGluZ3MgZm9yIFdlYiBBcHBzIGNsaWVudCBTREsuXCIsXHJcbiAgXCJhdXRob3JcIjogXCJWbGFkaXNsYXYgS2liZW5rbyA8d29sZnJhbS5kZXVzQGdtYWlsLmNvbT5cIixcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1RlbGVncmFtLU1pbmktQXBwcy90bWEuanMjcmVhZG1lXCIsXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXRAZ2l0aHViLmNvbTpUZWxlZ3JhbS1NaW5pLUFwcHMvdG1hLmpzLmdpdFwiLFxyXG4gICAgXCJkaXJlY3RvcnlcIjogXCJwYWNrYWdlcy9zZGstc29saWRcIlxyXG4gIH0sXHJcbiAgXCJidWdzXCI6IHtcclxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1RlbGVncmFtLU1pbmktQXBwcy90bWEuanMvaXNzdWVzXCJcclxuICB9LFxyXG4gIFwia2V5d29yZHNcIjogW1xyXG4gICAgXCJ0ZWxlZ3JhbS1taW5pLWFwcHNcIixcclxuICAgIFwidHlwZXNjcmlwdFwiLFxyXG4gICAgXCJzZGtcIixcclxuICAgIFwic29saWRqc1wiXHJcbiAgXSxcclxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcInNpZGVFZmZlY3RzXCI6IGZhbHNlLFxyXG4gIFwiZmlsZXNcIjogW1xyXG4gICAgXCJkaXN0XCIsXHJcbiAgICBcInNyY1wiXHJcbiAgXSxcclxuICBcIm1haW5cIjogXCIuL2Rpc3QvaW5kZXgudW1kLmNqc1wiLFxyXG4gIFwiYnJvd3NlclwiOiBcIi4vZGlzdC9pbmRleC51bWQuY2pzXCIsXHJcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcclxuICBcInR5cGVzXCI6IFwiLi9kaXN0L2R0cy9pbmRleC5kLnRzXCIsXHJcbiAgXCJleHBvcnRzXCI6IHtcclxuICAgIFwiLlwiOiB7XHJcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvZHRzL2luZGV4LmQudHNcIixcclxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcclxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2luZGV4LnVtZC5janNcIixcclxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9kaXN0L2luZGV4LnVtZC5janNcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwibGludFwiOiBcImVzbGludCAtYyAuZXNsaW50cmMuY2pzIHNyYy8qKi8qXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkB0bWEuanMvdXRpbHNcIjogXCJ3b3Jrc3BhY2U6KlwiLFxyXG4gICAgXCJAdG1hLmpzL3Nka1wiOiBcIndvcmtzcGFjZToqXCJcclxuICB9LFxyXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcInNvbGlkLWpzXCI6IFwiXjEuMC4wXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiZXNsaW50LWNvbmZpZy1jdXN0b21cIjogXCJ3b3Jrc3BhY2U6KlwiLFxyXG4gICAgXCJ0c2NvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcImJ1aWxkLXV0aWxzXCI6IFwid29ya3NwYWNlOipcIlxyXG4gIH0sXHJcbiAgXCJwdWJsaXNoQ29uZmlnXCI6IHtcclxuICAgIFwiYWNjZXNzXCI6IFwicHVibGljXCJcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxTQUFTLGtCQUFrQix3QkFBd0I7OztBQ0F0WjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsVUFBWTtBQUFBLEVBQ1osWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLElBQ1AsV0FBYTtBQUFBLEVBQ2Y7QUFBQSxFQUNBLE1BQVE7QUFBQSxJQUNOLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVc7QUFBQSxFQUNYLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLE9BQVM7QUFBQSxJQUNQO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLFFBQVU7QUFBQSxFQUNWLE9BQVM7QUFBQSxFQUNULFNBQVc7QUFBQSxJQUNULEtBQUs7QUFBQSxNQUNILE9BQVM7QUFBQSxNQUNULFFBQVU7QUFBQSxNQUNWLFNBQVc7QUFBQSxNQUNYLFNBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1QsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxpQkFBaUI7QUFBQSxJQUNqQixlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLGtCQUFvQjtBQUFBLElBQ2xCLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxpQkFBbUI7QUFBQSxJQUNqQix3QkFBd0I7QUFBQSxJQUN4QixVQUFZO0FBQUEsSUFDWixlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLGVBQWlCO0FBQUEsSUFDZixRQUFVO0FBQUEsRUFDWjtBQUNGOzs7QUR2REEsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTSxXQUFXLENBQUMsaUJBQWlCLGVBQWUsVUFBVTtBQUU1RCxJQUFPLHNCQUFRLGlCQUFpQjtBQUFBLEVBQzlCLGFBQWEsZ0JBQVk7QUFBQSxFQUN6QixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsRUFDckI7QUFBQSxFQUNBLFNBQVMsaUJBQWlCLFFBQVE7QUFBQSxFQUNsQyxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQ3pCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
