import ora from 'ora';
import chalk from 'chalk';

import { API } from '@/lib/API.js';
import { hl } from '@/chalk/hl.js';

export async function getDeploymentInfo({ project, tag, endpoint, token }: {
  endpoint: string;
  token: string;
  project: number;
  tag: string;
}): Promise<{
  allowedExtensions: string[];
  basePath: string;
  project: {
    title: string;
  };
  maxSize: number;
  maxFilesCount: number;
}> {
  const hlProject = hl(`#${project}`);
  const spinner = ora({
    text: `Fetching deploy information for project ${hlProject}`,
  }).start();
  try {
    const info = await new API(endpoint, token).getProjectDeploymentInfo(project, tag);
    spinner.succeed(`Fetched ${hl(info.project.title)} (${hlProject}) deploy info`);
    return info;
  } catch (e) {
    spinner.fail(
      chalk.red(`Failed to fetch ${hlProject} deploy info: ${
        e instanceof Error ? e.message : JSON.stringify(e)
      }`),
    );
    throw e;
  }
}