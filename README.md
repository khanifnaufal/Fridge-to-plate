# 🍳 Fridge-to-Plate

**Fridge-to-Plate** is a beautiful, modern web application built to help you discover amazing recipes based on the ingredients you already have in your fridge. Say goodbye to food waste and hello to culinary creativity!

Powered by [Spoonacular API](https://spoonacular.com/food-api), this app smartly calculates missing ingredients, provides full cooking instructions, and even lets you save your favorite recipes for offline use.

---

## ✨ Features

- 🔍 **Smart Ingredient Search**: Simply type in what you have in your fridge, and the app will match the best recipes based on a strictly calculated match percentage.
- 🎯 **Match Percentage Indicator**: Clearly see which recipes you can cook right away and what ingredients you are missing.
- 🎰 **"Feeling Lucky?" (Gacha Randomizer)**: Don't know what to cook? Click the magic button on the home page for a fast, roulette-style animation that picks a random secret recipe for you!
- 💾 **Offline Favorites**: Found a recipe you love? Hit the **Save Offline** button on the recipe page. The complete recipe details (including ingredients and instructions) are saved locally to your device via `localStorage` so you can view them anytime, even without an internet connection!
- 🌓 **Dark Mode Support**: Seamless integration with a modern Dark/Light theme toggle powered by `next-themes`.
- 🎨 **Beautiful UI/UX**: Built with a sleek, vibrant design featuring dynamic gradients, glassmorphism, and smooth micro-animations using `tailwindcss-animate` and Framer-inspired CSS transitions.
- ⚡ **Optimized Data Fetching**: Utilizes `@tanstack/react-query` for incredibly fast, cached, and reliable data fetching without unnecessary re-renders.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/) (v16+)
- **UI Library**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **State Management & Fetching**: [TanStack/React Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Animation**: Native CSS Transitions & `tailwindcss-animate`

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- A Spoonacular API Key. You can get a free one by registering at [Spoonacular API Console](https://spoonacular.com/food-api/console).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khanifnaufal/Fridge-to-plate.git
   cd Fridge-to-plate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Spoonacular API key:
   ```env
   NEXT_PUBLIC_SPOONACULAR_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

- `src/app/` - Next.js App Router pages (Home, Recipe Details, Saved Recipes).
- `src/components/` - Reusable UI components (RecipeCard, IngredientInput, GachaModal, ThemeToggle).
- `src/hooks/` - Custom React hooks (`useRecipes` for API fetching, `useFavorites` for localStorage).
- `src/lib/` - Utility functions and API configuration (`api.ts`).

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/khanifnaufal/Fridge-to-plate/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
