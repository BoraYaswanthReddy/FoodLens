# FoodLens

A smart food tracker that identifies food from images, provides nutritional information, and suggests meals.

## Demo

[Watch the Demo Video](https://drive.google.com/file/d/1xqeBxpJkWFm_dWJHXZbYWnN9nrXfwVcm/view?usp=sharing)

## Features

*   **Food Identification:** Identify food items from images.
*   **Nutritional Analysis:** Get detailed nutritional information for identified food.
*   **Food Logging:** Keep a log of your daily food intake.
*   **Meal Suggestions:** Get personalized meal suggestions based on your dietary preferences.

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd FoodLens
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    GOOGLE_AI_API_KEY=your_google_api_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
5.  Start the server:
    ```bash
    npm start
    ```

## Usage

To use the command-line interface (CLI) for adding food entries, viewing history, or getting meal suggestions, run the following command:

```bash
npm run cli
```

## API Endpoints

### Food Entries

*   `POST /api/food-entries`

    Adds a new food entry. The request body should be the raw image data.

*   `GET /api/food-entries`

    Retrieves the entire food log.

### Meal Suggestions

*   `POST /api/meal-suggestions`

    Get a meal suggestion. The request body should be a JSON object with `diet` and `cuisine` properties.

    **Example:**
    ```json
    {
      "diet": "vegetarian",
      "cuisine": "Italian"
    }
    ```

## Project Structure

```
/
├── public/
│   └── uploads/            # Uploaded images are stored here
├── src/
│   ├── aiProvider.ts       # Manages the AI provider
│   ├── foodIdentifier.ts   # Identifies food from images
│   ├── imageUploader.ts    # Handles image uploads to Cloudinary
│   ├── index.ts            # CLI entry point
│   ├── logManager.ts       # Manages the food log
│   ├── nutritionAnalyzer.ts# Analyzes nutritional information
│   ├── server.ts           # Express server
│   ├── suggestionEngine.ts # Generates meal suggestions
│   └── types.ts            # TypeScript types
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
