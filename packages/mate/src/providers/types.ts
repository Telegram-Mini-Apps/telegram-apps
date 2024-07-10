export interface DeployProvider {
  /**
   * Returns a public link, associated with the specified project.
   * @param project - project name. Example: "my-mini-app"
   */
  getLink(project: string): Promise<string | undefined | null>;
}