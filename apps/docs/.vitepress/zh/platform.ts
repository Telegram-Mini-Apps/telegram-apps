import { sectionGen } from "../utils";

export const platformLinksGenerator = (prefix: string = "") => {
  const BASE = prefix + "/platform";

  const section = sectionGen(BASE);

  const platformNavItem = {
    text: "平台",
    link: `${BASE}/about`,
  };

  const platformSidebar = {
    [BASE]: [
      section("介绍", {
        "关于平台": "about",
      }),
      section("功能特性", {
        "关闭行为": "closing-behavior",
        "滑动行为": "swipe-behavior",
        "触觉反馈": "haptic-feedback",
      }),
      section("应用通信", {
        "流程定义": "apps-communication",
        "方法": "methods",
        "事件": "events",
      }),
      section("启动参数", {
        "关于": "launch-parameters",
        "启动参数": "start-parameter",
        "初始数据": "init-data",
      }),
      section("开发", {
        "调试": "debugging",
        "测试环境": "test-environment",
      }),
      section("UI", {
        "返回按钮": "back-button",
        "主按钮": "main-button",
        "弹窗": "popup",
        "设置按钮": "settings-button",
        "主题": "theming",
        "视口": "viewport",
      }),
      section("指南", {
        "授权用户": "authorizing-user",
        "创建新应用": "creating-new-app",
        "获取应用链接": "getting-app-link",
        "固定应用": "sticky-app",
        "从 VK 迁移": "migrating-from-vk",
      }),
    ],
  };

  return {
    platformNavItem,
    platformSidebar,
  };
};
