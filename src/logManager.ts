import * as fs from 'fs/promises';
import { FoodEntry } from '@/types';

const LOG_FILE = 'food_log.json';

export async function readLog(): Promise<FoodEntry[]> {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(data) as FoodEntry[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeLog(log: FoodEntry[]): Promise<void> {
  await fs.writeFile(LOG_FILE, JSON.stringify(log, null, 2));
}

export async function addEntry(entry: FoodEntry): Promise<void> {
  const log = await readLog();
  log.push(entry);
  await writeLog(log);
}
