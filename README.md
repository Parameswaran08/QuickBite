 Bite Finder - Restaurant Discovery & Food Delivery App

A modern, responsive web application for discovering restaurants, browsing menus, and placing food orders online.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Development](#-development)
- [Deployment](#-deployment)

---

## ✨ Features

### 🏪 Restaurant Browsing
- Browse restaurants in a beautiful grid layout
- View restaurant ratings, delivery time, and pricing
- Responsive design for mobile, tablet, and desktop

### 🔍 Search & Filter
- **Real-time search** by restaurant name or cuisine type
- **Filter by cuisine** (Italian, Indian, American, Japanese, Mexican, etc.)
- **Filter by rating** (3.5+, 4.0+, 4.5+)
- Combine multiple filters for precise results

### 📱 Restaurant Details
- Click any restaurant card to view detailed information
- Large hero images with gradient overlays
- Complete restaurant information (address, hours, menu highlights)
- Special features badges (Top Rated, Pure Veg, Fast Delivery)
- Menu highlights with popular dishes
- Order Now button with toast notifications

### 🎨 UI/UX Features
- Smooth animations and transitions
- Staggered card animations
- Hover effects and visual feedback
- Loading states with spinners
- Empty states with helpful messages
- Toast notifications for user actions
- Keyboard navigation support
- Accessibility compliant

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Data access control

### State Management
- **React Context API** - Global state (Cart)
- **React Hooks** - Local state management

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase account** (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd bite-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

---

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Run Database Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the SQL from `supabase/migrations/20251118150821_733857ab-76c9-4103-9183-6f586800a3e5.sql`
5. Paste and click **Run**

### Step 3: Verify Setup

Run this query in SQL Editor to verify:
```sql
SELECT COUNT(*) FROM public.restaurants;
```
You should see **8 restaurants**.

### Database Schema

The `restaurants` table includes:
- `id` - Unique identifier (UUID)
- `name` - Restaurant name
- `cuisine` - Type of cuisine
- `rating` - Customer rating (0-5)
- `delivery_time` - Estimated delivery time
- `image_url` - Restaurant image
- `address` - Physical location
- `cost_for_two` - Price for two people
- `is_veg` - Vegetarian only flag
- `is_active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

---

## 📁 Project Structure

```
bite-finder/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # App header
│   │   ├── SearchBar.tsx   # Search input
│   │   ├── FilterBar.tsx   # Filter controls
│   │   ├── RestaurantCard.tsx        # Restaurant card
│   │   └── RestaurantDetailModal.tsx # Detail modal
│   ├── contexts/           # React contexts
│   │   └── CartContext.tsx # Cart state management
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   └── NotFound.tsx    # 404 page
│   ├── types/              # TypeScript types
│   │   └── restaurant.ts   # Restaurant interfaces
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Build
```bash
npm run build        # Build for production
npm run build:dev    # Build in development mode
```

### Preview
```bash
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Run ESLint
```

---

## 💻 Development

### Adding New Features

1. Create feature spec in `.kiro/specs/`
2. Implement components in `src/components/`
3. Add pages in `src/pages/`
4. Update routing in `src/App.tsx`
5. Test thoroughly

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Follow accessibility guidelines

### Environment Variables

Required variables in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

---

## 🚢 Deployment

### Build for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. The production-ready files will be in the `dist` folder

### Deploy to Hosting Providers

Deploy the `dist` folder to any of these platforms:

**Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages**
1. Push your code to GitHub
2. Go to Settings → Pages
3. Select branch and `/dist` folder
4. Save and deploy

**Other Options**
- AWS S3 + CloudFront
- Firebase Hosting
- Render
- Railway
- Any static hosting service

### Environment Variables

Make sure to set these environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

---

## 🎯 Current Features Status

✅ **Completed:**
- Restaurant browsing with grid layout
- Real-time search functionality
- Multi-filter system (cuisine, rating)
- Restaurant detail modal view
- Responsive design (mobile, tablet, desktop)
- Error handling and loading states
- Toast notifications
- Keyboard navigation
- Accessibility support

🚧 **In Progress:**
- Shopping cart functionality
- Checkout and payment flow
- Order tracking
- User authentication

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Workflow

1. Clone the repository
2. Install dependencies
3. Create a new branch for your feature
4. Make your changes
5. Test thoroughly
6. Submit a pull request

---

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Docs**: [react.dev](https://react.dev)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI components from shadcn/ui
- Backend powered by Supabase
- Icons from Lucide React


