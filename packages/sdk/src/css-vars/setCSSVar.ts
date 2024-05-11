/**
 * Sets CSS variable globally.
 * @param name - variable name.
 * @param value - variable value.
 */
export function setCSSVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}
