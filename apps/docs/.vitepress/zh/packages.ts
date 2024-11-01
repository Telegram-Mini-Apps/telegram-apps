import type { DefaultTheme } from "vitepress";

import { sectionGen } from "../utils";

type Sidebar = DefaultTheme.Sidebar;
type NavItemWithLink = DefaultTheme.NavItemWithLink;

function scope(path: string, title?: string): [string, string] {
  title ||=
    path[0].toUpperCase() +
    path.slice(1).replace(/-./g, (m) => " " + m[1].toUpperCase());

  return [title, path];
}

function fromEntries(entries: [string, any][]): Record<string, any> {
  const result = {};
  entries.forEach(([k, v]) => {
    result[k] = v;
  });

  return result;
}

export const packagesLinksGenerator = (prefix: string = "") => {
  const BASE = prefix + "/packages";

  const section = sectionGen(BASE);

  const packagesNavItem: NavItemWithLink = {
    text: "软件包",
    link: `${BASE}/telegram-apps-create-mini-app`,
  };

  const packagesSidebar: Sidebar = {
    [BASE]: [
      section("CLI", {
        "@telegram-apps/create-mini-app": "telegram-apps-create-mini-app",
        "@telegram-apps/mate": [
          "telegram-apps-mate",
          {
            "托管": "hosting",
          },
        ],
      }),
      section("TypeScript", {
        "@telegram-apps/signals": "telegram-apps-signals",
        "@telegram-apps/bridge": [
          "telegram-apps-bridge",
          {
            "方法": "methods",
            "事件": "events",
            "环境": "environment",
            "启动参数": "launch-parameters",
            "全局变量": "globals",
          },
        ],
        "@telegram-apps/sdk": [
          { url: "telegram-apps-sdk", page: false },
          {
            "@1.x": [
              "1-x",
              {
                "组件": [
                  "components",
                  {
                    "返回按钮": "back-button",
                    "生物识别管理": "biometry-manager",
                    "关闭行为": "closing-behavior",
                    "云存储": "cloud-storage",
                    "触觉反馈": "haptic-feedback",
                    "初始数据": "init-data",
                    "发票": "invoice",
                    "主按钮": "main-button",
                    "小程序": "mini-app",
                    "弹窗": "popup",
                    "二维码扫描器": "qr-scanner",
                    "设置按钮": "settings-button",
                    "滑动行为": "swipe-behavior",
                    "主题参数": "theme-params",
                    "工具": "utils",
                    "视口": "viewport",
                  },
                ],
                "环境": "environment",
                "方法和事件": "methods-and-events",
                "启动参数": "launch-parameters",
                "主题参数": "theme-parameters",
                "初始数据": [
                  "init-data",
                  {
                    "初始数据": "init-data",
                    "聊天": "chat",
                    "用户": "user",
                  },
                ],
                "导航": [
                  "navigation",
                  {
                    "浏览器导航": "browser-navigator",
                  },
                ],
                "CSS 变量": "css-variables",
              },
            ],
            "@2.x": [
              "2-x",
              {
                "初始化": "initializing",
                "范围": "scopes",
                "组件": [
                  { url: "components", page: false },
                  fromEntries([
                    scope("back-button", "返回按钮"),
                    scope("biometry", "生物识别管理"),
                    scope("closing-behavior", "关闭行为"),
                    scope("cloud-storage", "云存储"),
                    scope("haptic-feedback", "触觉反馈"),
                    scope("init-data", "初始数据"),
                    scope("invoice", "发票"),
                    scope("main-button", "主按钮"),
                    scope("mini-app", "小程序"),
                    scope("popup", "弹窗"),
                    scope("qr-scanner", "二维码扫描器"),
                    scope("secondary-button", "次要按钮"),
                    scope("settings-button", "设置按钮"),
                    scope("swipe-behavior", "滑动行为"),
                    scope("theme-params", "主题参数"),
                    scope("viewport", "视口"),
                  ]),
                ],
                "工具": [
                  { url: "utils", page: false },
                  fromEntries([
                    scope("links", "链接"),
                    scope("privacy", "隐私"),
                    scope("uncategorized", "未分类"),
                  ]),
                ],
              },
            ],
          },
        ],
        "@telegram-apps/sdk-react": [
          {
            url: "telegram-apps-sdk-react",
            page: false,
          },
          {
            "@1.x": "1-x",
            "@2.x": "2-x",
          },
        ],
        "@telegram-apps/sdk-solid": [
          {
            url: "telegram-apps-sdk-solid",
            page: false,
          },
          {
            "@1.x": "1-x",
            "@2.x": "2-x",
          },
        ],
        '@telegram-apps/sdk-vue': '/telegram-apps-sdk-vue',
        '@telegram-apps/sdk-svelte': '/telegram-apps-sdk-svelte',
        '@telegram-apps/solid-router-integration': '/telegram-apps-solid-router-integration',
        '@telegram-apps/react-router-integration': '/telegram-apps-react-router-integration',
      }),
      section("Node", {
        "@telegram-apps/init-data-node": "telegram-apps-init-data-node",
      }),
      section("GoLang", {
        "init-data-golang": "init-data-golang",
      }),
    ],
  };

  return {
    packagesNavItem,
    packagesSidebar,
  };
};
