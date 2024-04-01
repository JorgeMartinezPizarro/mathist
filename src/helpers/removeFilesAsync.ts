import * as fs from 'node:fs/promises';
import path from 'path'

export default async (directory: string, extensions: string[], seconds: number) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  
    const files = Array.from(await fs.readdir(directory)).filter((file) => {
        return extensions.indexOf(file.split('.').at(-1)) !== -1;
    });
  
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        const birthTime = Math.floor(stats.birthtimeMs / 1000);
        if (currentTimeInSeconds - birthTime > seconds) {
          await fs.rm(filePath);
        }
    }
  }