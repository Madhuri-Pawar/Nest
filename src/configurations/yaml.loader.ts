
// config/yaml.loader.ts
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export const loadYamlConfig = () => {
  const env = process.env.NODE_ENV || 'dev';
  const filePath = join(process.cwd(), `config/config.${env}.yaml`);
  return yaml.load(fs.readFileSync(filePath, 'utf8')) as Record<string, any>;
};
