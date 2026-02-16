# CMC Marketplace - Frontend

React + TypeScript frontend for the CMC IP Marketplace.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Supabase** - Auth + Database client
- **TanStack Query** - Server state management
- **Lucide React** - Icons
- **React Hook Form** + **Zod** - Form validation

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run dev server
npm run dev

# Open http://localhost:5173
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (Button, Card, Input, etc.)
│   └── layout/      # Layout components (Header, Footer, Layout)
├── pages/           # Page components (Home, Login, Register, etc.)
├── services/        # API clients, Supabase client
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── lib/             # Utility functions
└── App.tsx          # Main app with routes
```

## Brand Colors

From `tailwind.config.js`:

- **Navy**: `#1A1F3C` - Primary brand color
- **Gold**: `#D4AF37` - Accent color
- **Warm Gray**: `#6B7280` - Text and secondary elements

## Components

### UI Components

All in `src/components/ui/`:

- `Button` - Primary, secondary, gold, ghost, danger variants
- `Card` - Card container with header, title, content, footer
- `Input` - Text input with label and error state
- `Textarea` - Multi-line text input
- `Select` - Dropdown select
- `Badge` - Status badges (navy, gold, success, warning, danger)

### Layout Components

- `Layout` - Main layout wrapper with header and footer
- `Header` - Top navigation with auth state
- `Footer` - Site footer with links

## CSS Classes

Tailwind utilities defined in `src/index.css`:

**Buttons:**
- `.btn-primary` - Navy background
- `.btn-secondary` - Navy outline
- `.btn-gold` - Gold background
- `.btn-ghost` - Text only
- `.btn-danger` - Red background

**Cards:**
- `.card` - Standard card with shadow
- `.card-elevated` - Card with elevated shadow

**Inputs:**
- `.input` - Standard input style
- `.input-error` - Input with error state

**Badges:**
- `.badge-navy`, `.badge-gold`, `.badge-success`, etc.

## Pages

- `/` - Home (landing page)
- `/login` - Login page
- `/register` - Registration page
- `/library` - Browse IPs (placeholder)
- `/dashboard` - User dashboard (placeholder)

## Development

```bash
# Run dev server with hot reload
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## TODO

- [ ] Implement Supabase auth integration
- [ ] Add protected routes (require auth)
- [ ] Create auth context/hook
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Complete Library page (Week 5)
- [ ] Complete Dashboard page (Week 9)

## Notes

- Auth is currently mocked (login/register don't work yet)
- Week 4 will add Supabase integration
- Design system follows brand guidelines in `/docs/BRAND_GUIDELINES.md`
