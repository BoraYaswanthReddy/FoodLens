import express from 'express';
import cors from 'cors';
import { identifyFood } from './foodIdentifier';
import { getNutritionalInfo } from './nutritionAnalyzer';
import { addEntry, readLog } from './logManager';
import { getMealSuggestion } from './suggestionEngine';
import { FoodEntry } from './types';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/food-entries', express.raw({ type: 'application/octet-stream', limit: '10mb' }), async (req, res) => {
  if (!req.body) {
    res.status(400).send('No image uploaded.');
    return;
  }

  try {
    const foodName = await identifyFood(req.body);
    const nutritionalInfo = await getNutritionalInfo(foodName);
    const newEntry: FoodEntry = {
      name: foodName,
      ...nutritionalInfo,
      timestamp: new Date().toISOString(),
    };
    await addEntry(newEntry);
    res.json(newEntry);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get('/api/food-entries', async (req, res) => {
  try {
    const log = await readLog();
    res.json(log);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.post('/api/meal-suggestions', async (req, res) => {
  const { diet, cuisine } = req.body;
  try {
    const suggestion = await getMealSuggestion(diet, cuisine);
    res.json(suggestion);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
