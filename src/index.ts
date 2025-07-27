import * as dotenv from 'dotenv';
import inquirer from 'inquirer';
import { identifyFood } from '@/foodIdentifier';
import { getNutritionalInfo } from '@/nutritionAnalyzer';
import { addEntry, readLog } from '@/logManager';
import { getMealSuggestion } from '@/suggestionEngine';
import { FoodEntry } from '@/types';

dotenv.config();

async function mainMenu() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Add a new food entry',
          'View food history',
          'Get a meal suggestion',
          new inquirer.Separator(),
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'Add a new food entry':
        await addFoodEntry();
        break;
      case 'View food history':
        await viewHistory();
        break;
      case 'Get a meal suggestion':
        await getSuggestion();
        break;
      case 'Exit':
        console.log('Goodbye!');
        return;
    }
    console.log('\n---\n');
  }
}

import { readFile } from 'fs/promises';

async function addFoodEntry() {
  const { imagePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'imagePath',
      message: 'Please enter the path to the food image:',
    },
  ]);

  if (!imagePath) {
    console.log("Image path cannot be empty.");
    return;
  }

  try {
    console.log('Identifying food...');
    
    const imageBuffer = await readFile(imagePath);
    const foodName = await identifyFood(imageBuffer);
    console.log(`Identified food: ${foodName}`);

    console.log('Getting nutritional info...');
    const nutritionalInfo = await getNutritionalInfo(foodName);
    console.log('Nutritional Info:', nutritionalInfo);

    const newEntry: FoodEntry = {
      name: foodName,
      ...nutritionalInfo,
      timestamp: new Date().toISOString(),
    };

    await addEntry(newEntry);
    console.log('Food entry added successfully!');
  } catch (error: any) {
    console.error('Error adding food entry:', error.message);
  }
}

async function viewHistory() {
  try {
    const log = await readLog();
    if (log.length === 0) {
      console.log('Your food log is empty.');
      return;
    }
    console.log('Your food history:');
    console.table(log);
  } catch (error: any) {
    console.error('Error reading food history:', error.message);
  }
}

async function getSuggestion() {
  const { diet, cuisine } = await inquirer.prompt([
    {
      type: 'list',
      name: 'diet',
      message: 'Please select a diet type:',
      choices: ['balanced', 'vegetarian', 'vegan', 'keto'],
    },
    {
      type: 'input',
      name: 'cuisine',
      message: 'What cuisine would you prefer (e.g., Indian, Chinese, Italian)?',
      default: 'any',
    },
  ]);

  try {
    console.log(`Getting a ${diet} meal suggestion with a ${cuisine} influence...`);
    const suggestion = await getMealSuggestion(diet, cuisine);
    console.log('\nMeal Suggestion:\n');
    console.log(suggestion);
  } catch (error: any) {
    console.error('Error getting meal suggestion:', error.message);
  }
}

mainMenu().catch(console.error);
