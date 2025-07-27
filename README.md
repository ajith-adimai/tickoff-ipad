# TickOff - Habit Tracker for iPad

A modern, responsive habit tracking application designed specifically for iPad, built with React, TypeScript, and Tailwind CSS.

## Features

- **Habit Tracking**: Create, edit, and track daily habits
- **Progress Visualization**: Beautiful calendar view showing habit completion over time
- **Streak Tracking**: Monitor your consistency with streak counters
- **Weekly Task Management**: New weekly task card with day-by-day task organization
- **Responsive Design**: Optimized for iPad and desktop use
- **Modern UI**: Clean, intuitive interface with smooth animations

## New Weekly Task Card

The application now includes a new **WeeklyTaskCard** component that provides:

- **Week Navigation**: Switch between different weeks (Week 1-4)
- **Daily Tasks**: Organize tasks by day of the week (Mon-Fri)
- **Task Actions**: Mark tasks as complete or reject with intuitive icons
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Add New Tasks**: Dynamic task creation with inline input
- **Responsive Design**: Works seamlessly on iPad and desktop

### Features of the Weekly Task Card:

1. **Week Selection**: Horizontal navigation between weeks
2. **Task Management**: Each task shows day abbreviation, description, and action buttons
3. **Visual Feedback**: Completed tasks are highlighted with green styling and strikethrough
4. **Interactive Icons**: Green checkmark for completion, red X for rejection
5. **Progress Overview**: Header shows completion statistics
6. **Add Functionality**: Plus button to add new tasks
7. **Smooth Animations**: Framer Motion animations for enhanced UX

## Components

- `Dashboard.tsx` - Main dashboard with stats and habit list
- `HabitCard.tsx` - Individual habit tracking card
- `WeeklyTaskCard.tsx` - New weekly task management component
- `AddHabitModal.tsx` - Modal for creating new habits
- `Auth.tsx` - Authentication component
- `LandingPage.tsx` - Landing page with app overview

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Build

To create a production build:

```bash
npm run build
```

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Backend)
- Lucide React (Icons)

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── HabitCard.tsx          # Individual habit cards
│   ├── WeeklyTaskCard.tsx     # Weekly task management
│   ├── AddHabitModal.tsx      # Add habit modal
│   ├── Auth.tsx              # Authentication
│   └── LandingPage.tsx       # Landing page
├── supabaseClient.ts         # Supabase configuration
└── App.tsx                   # Main app component
```

## Deployment

The app is configured for deployment on various platforms:

- **Vercel**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **App Store**: See `APP_STORE_DEPLOYMENT.md`
- **iPad**: See `IPAD_DEPLOYMENT_GUIDE.md`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
