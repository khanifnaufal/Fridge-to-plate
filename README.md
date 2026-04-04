# 🍳 Fridge-to-Plate

**Fridge-to-Plate** is a beautiful, modern web application built to help you discover amazing recipes based on the ingredients you already have in your fridge. Say goodbye to food waste and hello to culinary creativity!

Powered by [Spoonacular API](https://spoonacular.com/food-api), this app smartly calculates missing ingredients, provides full cooking instructions, and even lets you save your favorite recipes for offline use.

---

## ✨ Features

- 📅 **Weekly Meal Planner**: Plan your week with a premium "Gourmet Scheduler". Organize Breakfast, Lunch, and Dinner with an intuitive grid.
- 🔄 **Cloud Sync (Supabase)**: Created an account to securely save and sync your meal plans across all your devices.
- 🖱️ **Drag-and-Drop Scheduling**: Seamlessly move your saved recipes from the "Collectibles" sidebar directly into your weekly calendar using `dnd-kit`.
- 🧠 **Ingredient Autocomplete & Semantic Search**: Type naturally and get instant suggestions. The app understands semantic categories (e.g., searching for "Meat" includes Steak, Ribs, and more).
- 🛒 **Smart Shopping List**: Automatically generate a checklist of ingredients needed for your weekly meal plan, so you never forget an item at the store.
- 🎰 **"Feeling Lucky?" (Gacha Randomizer)**: Don't know what to cook? Use the magic roulette to pick a random "Secret Recipe".
- 📊 **Nutrition Dashboard**: Professional-grade nutrition breakdown with interactive doughnut charts for calories, protein, fat, and carbs.
- 💰 **Price Estimator**: Real-time cost estimation per serving, with automatic USD to IDR conversion.
- 🔄 **Ingredient Substitutes**: Missing something? Get instant AI-powered recommendations for ingredient alternatives.
- 💾 **Offline Favorites**: Save full recipe details (ingredients & instructions) to your device for offline viewing.
- 🌓 **Dark Mode & Premium UI**: A stunning interface featuring glassmorphism, vibrant gradients, and smooth micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/) (v16+)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **UI & Icons**: [Tailwind CSS](https://tailwindcss.com/) (v4), [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack/React Query](https://tanstack.com/query/latest)
- **Drag & Drop**: [@dnd-kit/core](https://dnd-kit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: Native CSS Transitions & `tailwindcss-animate`
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- [Spoonacular API Key](https://spoonacular.com/food-api/console)
- [Supabase Project](https://supabase.com/) (URL and Anon Key)

### Installation & Setup

1. **Clone & Install:**
   ```bash
   git clone https://github.com/khanifnaufal/Fridge-to-plate.git
   cd Fridge-to-plate
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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

