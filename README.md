# TickOff - iPad Habit Tracker

A modern, iPad-optimized habit tracking application built with React, TypeScript, and Supabase. Track your daily habits, build streaks, and achieve your goals with a beautiful, intuitive interface.

## Features

- 🎯 **Beautiful iPad-Optimized Design** - Responsive layout designed specifically for iPad screens
- 🔐 **User Authentication** - Secure sign-up and sign-in with Supabase Auth
- ✅ **Habit Tracking** - Create, complete, and track daily, weekly, or monthly habits
- 📊 **Progress Dashboard** - View your daily progress, streaks, and statistics
- 🎨 **Modern UI/UX** - Smooth animations and intuitive interactions
- 📱 **Touch-Friendly** - Optimized for touch interactions on iPad
- 🌈 **Beautiful Gradients** - Modern gradient backgrounds and visual design

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom iPad optimizations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database)
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tickoff-ipad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Set up the database**
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create habits table
   CREATE TABLE habits (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create habit_completions table
   CREATE TABLE habit_completions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(habit_id, date)
   );

   -- Enable Row Level Security
   ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
   ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own habits" ON habits
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own habits" ON habits
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own habits" ON habits
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own habits" ON habits
     FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view their own habit completions" ON habit_completions
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own habit completions" ON habit_completions
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own habit completions" ON habit_completions
     FOR DELETE USING (auth.uid() = user_id);
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Open in your browser**
   Navigate to `http://localhost:3000` and open in Safari on your iPad or use the iPad simulator.

## Usage

### Creating an Account
1. Open the app on your iPad
2. Tap "Don't have an account? Sign up"
3. Enter your email and password
4. Check your email for the confirmation link
5. Sign in with your credentials

### Adding Habits
1. Tap the "+" button (floating action button)
2. Enter a habit title (required)
3. Add an optional description
4. Select frequency (daily, weekly, or monthly)
5. Tap "Add Habit"

### Tracking Habits
1. View your habits on the dashboard
2. Tap the circle next to a habit to mark it as complete
3. Tap again to unmark if needed
4. View your progress in the stats cards

### Managing Habits
- **Edit**: Hover over a habit card and tap the edit icon (coming soon)
- **Delete**: Hover over a habit card and tap the trash icon

## iPad Optimizations

- **Responsive Design**: Optimized for iPad screen sizes (768px and 1024px)
- **Touch Interactions**: Large touch targets and smooth animations
- **Landscape Support**: Full landscape and portrait orientation support
- **Safari Optimized**: Optimized for Safari on iPad
- **PWA Ready**: Can be installed as a web app on iPad

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication component
│   ├── Dashboard.tsx   # Main dashboard
│   ├── HabitCard.tsx   # Individual habit card
│   └── AddHabitModal.tsx # Add habit modal
├── supabaseClient.ts   # Supabase configuration
├── App.tsx            # Main app component
└── index.css          # Global styles with Tailwind
```

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Primary: Blue gradient theme
- Success: Green for completed habits
- Custom animations and transitions

### Styling
All styles are built with Tailwind CSS classes and custom components defined in `src/index.css`.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add your environment variables in the Vercel dashboard

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on iPad simulator
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for iPad users who want to build better habits.
