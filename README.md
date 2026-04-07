# FoodHub - Premium Food Marketplace Platform

<div align="center">

**FoodHub** is a full-stack food discovery and delivery platform designed with a **Refined Brutalist** aesthetic.

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## Overview

FoodHub connects discerning foodies with top-tier local culinary providers through a carefully crafted, high-contrast interface. Built with modern web technologies, it delivers a premium experience for customers, restaurant providers, and administrators alike.

---

## ✨ Design Philosophy: Refined Brutalism

FoodHub's visual identity is built on **bold authenticity** and **purposeful simplicity**:

- **Color Palette**:
  - Brand Orange (`#ff5722`) - Primary action & accent
  - Deep Charcoal (`#0a0a0a`) - Bold typography & depth
  - Soft Cream (`#fdfcf8`) - Refined background & breathing room

- **Typography**: Elegant serifs for hierarchy paired with bold, ultra-heavy sans-serifs for impact

- **Micro-interactions**: Smooth scrolling via [Lenis](https://lenis.darkroom.engineering/) and purposeful animations with [Framer Motion](https://www.framer.com/motion/) create a refined, polished experience

---

## 🚀 Key Features

### For Customers

- **Curated Marketplace**: Browse high-end meals and featured restaurants.
- **Seamless Cart & Checkout**: A fluid, neobrutalist cart experience.
- **Order Tracking**: Keep tabs on your culinary journey from kitchen to doorstep.
- **Social Auth**: Quick login via Google and other providers (powered by Better Auth).

### For Providers & Admins

- **Restaurant Dashboard**: Manage menus, orders, and restaurant profiles.
- **Admin Panel**: Comprehensive oversight of the entire marketplace ecosystem.
- **Onboarding**: Simple flow for restaurants to "Become a Provider".

---

## 🛠️ Tech Stack

| Layer                  | Technology                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Framework**          | [Next.js](https://nextjs.org/) (App Router)                              |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/)                              |
| **UI Components**      | [shadcn](https://shadcn.com/), [Lucide React](https://lucide.dev/)       |
| **Animations**         | [Framer Motion](https://www.framer.com/motion/)                          |
| **Authentication**     | [Better Auth](https://better-auth.com/)                                  |
| **State Management**   | [Zustand](https://zustand.dev/)                                          |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Smooth Scrolling**   | [Lenis](https://lenis.darkroom.engineering/)                             |
| **Package Manager**    | [pnpm](https://pnpm.io/)                                                 |

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (LTS recommended)
- [pnpm](https://pnpm.io/) v8 or higher

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/TOMJID/foodhub-frontend.git
   cd foodhub-frontend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:

   Create a `.env.local` file in the root directory:

   ```env
   # Authentication
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth

   # API Endpoints
   NEXT_PUBLIC_API_URL=http://localhost:3000/api

   # Third-party Auth (Google, etc.)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the development server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser. Changes auto-refresh thanks to Next.js hot reloading.

---

## 🏗️ Project Structure

```text
src/
├── app/                # Next.js App Router & Pages
│   ├── api/           # API routes (authentication, data endpoints)
│   ├── admin/         # Admin dashboard routes
│   ├── restaurant-dashboard/  # Provider dashboard
│   ├── auth/          # Authentication pages (login, register, etc.)
│   ├── checkout/      # Checkout flow
│   └── [user-features]/       # Customer-facing pages
│
├── components/        # Reusable React Components
│   ├── ui/           # Base UI atoms (buttons, inputs, dialogs, etc.)
│   ├── admin/        # Admin-specific components
│   ├── account/      # User account components
│   ├── checkout/     # Checkout flow components
│   └── [features]/   # Feature-specific components
│
├── lib/               # Utilities & Shared Logic
│   ├── auth-client.ts     # Authentication helpers
│   └── utils.ts           # Common utilities
│
├── store/             # Zustand State Management
│   ├── use-cart-store.ts       # Shopping cart state
│   ├── use-user-store.ts       # User/auth state
│   └── use-ui-store.ts         # UI state (modals, etc.)
│
└── public/            # Static assets & images
```

---

## 📜 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start development server (port 3000) |
| `pnpm build`      | Create optimized production build    |
| `pnpm start`      | Start production server              |
| `pnpm lint`       | Run ESLint to check code quality     |
| `pnpm type-check` | Run TypeScript type checking         |

---

## 🎯 Key Pages & Features

### Customer Facing

- **Landing Page** (`/`) - Hero, featured restaurants, categories
- **Meals Catalog** (`/meals`) - Browse all meals with filtering
- **Restaurant Details** (`/restaurants/[id]`) - View restaurant info, menus, reviews
- **Checkout** (`/checkout`) - Cart review & order placement
- **Order Tracking** (`/orders/[id]`) - Track order status
- **Account** (`/account`) - Profile, order history, saved preferences

### Provider & Admin

- **Become a Provider** (`/become-provider`) - Restaurant onboarding
- **Restaurant Dashboard** (`/restaurant-dashboard`) - Manage menu, view orders
- **Admin Panel** (`/admin`) - Manage users, restaurants, orders, categories

### Authentication

- Social login with Google & other providers (Better Auth)
- Email verification flow
- Password reset functionality

---

## 🔐 Security & Authentication

- **Better Auth** handles OAuth and session management
- Environment variables keep sensitive keys secure
- Routes are protected based on user roles (customer, provider, admin)
- Form validation with Zod ensures data integrity

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push to `main`

### Other Platforms

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Create a feature branch**: `git checkout -b feature/amazing-feature`
2. **Make your changes** and commit: `git commit -m 'Add amazing feature'`
3. **Push to your fork**: `git push origin feature/amazing-feature`
4. **Open a Pull Request** with a clear description

### Code Standards

- Use TypeScript for all new components
- Follow existing component patterns in `src/components/`
- Keep components focused and reusable
- Use Tailwind CSS for styling (refer to design tokens)
- Add proper error handling and loading states

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
pnpm dev -- -p 3001
```

### Node Modules Issues

```bash
# Clear cache and reinstall
pnpm install --force
```

### TypeScript Errors

```bash
# Check types without building
pnpm type-check
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support & Contact

Have questions or need help? Open an issue on GitHub or reach out to the development team.

---

<div align="center">

**Made with love for food enthusiasts everywhere**

[Back to top](#foodhub---premium-food-marketplace-platform)

</div>
