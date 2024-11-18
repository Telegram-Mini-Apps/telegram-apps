import { sectionGen } from "./utils";

export const platformLinksGenerator = (prefix: string = "") => {
  const BASE = prefix + "/platform";

  const section = sectionGen(BASE);

  const platformNavItem = {
    text: "Platform",
    link: `${BASE}/about`,
  };

  const platformSidebar = {
    [BASE]: [
      section("Introduction", {
        "About Platform": "about",
      }),
      section("Functional Features", {
        "Closing Behavior": "closing-behavior",
        "Full Screen": "full-screen",
        "Swipe Behavior": "swipe-behavior",
        "Haptic Feedback": "haptic-feedback",
      }),
      section("Apps Communication", {
        "Flow Definition": "apps-communication",
        Methods: "methods",
        Events: "events",
      }),
      section("Launch Parameters", {
        About: "launch-parameters",
        "Start Parameter": "start-parameter",
        "Init Data": "init-data",
      }),
      section("Development", {
        Debugging: "debugging",
        "Test Environment": "test-environment",
      }),
      section("UI", {
        "Back Button": "back-button",
        "Main Button": "main-button",
        Popup: "popup",
        "Settings Button": "settings-button",
        Theming: "theming",
        Viewport: "viewport",
      }),
      section("Guides", {
        "Authorizing User": "authorizing-user",
        "Creating New App": "creating-new-app",
        "Getting App Link": "getting-app-link",
        "Sticky App": "sticky-app",
        "Migrating from VK": "migrating-from-vk",
      }),
    ],
  };

  return {
    platformNavItem,
    platformSidebar,
  };
};
