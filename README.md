# FoodHub - Food Marketplace

**FoodHub** is a high-end food discovery and delivery platform designed with a **Refined Brutalist** aesthetic. It connects discerning foodies with top-tier local culinary providers, offering a curated journey of flavor and craft.

---

## ✨ Design Philosophy: Refined Brutalism

FoodHub stands out with its bold, high-contrast design system:

- **Palette**: Vibrant Brand Orange (`#ff5722`), Deep Charcoal (`#0a0a0a`), and Soft Cream (`#fdfcf8`).
- **Typography**: Elegant serifs paired with bold, ultra-heavy sans-serifs.
- **Interactions**: Smooth scrolling (powered by Lenis) and micro-animations (Framer Motion) that bring the interface to life.

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

| Layer                  | Technology                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **Framework**          | [Next.js ](https://nextjs.org/) (App Router)                                                 |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Components**         | [shadcn](https://shadcn.com/), [Lucide React](https://lucide.dev/)                           |
| **Authentication**     | [Better Auth](https://better-auth.com/)                                                      |
| **State Management**   | [Zustand](https://zustand-demo.pmnd.rs/)                                                     |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                     |
| **Smooth Scrolling**   | [Lenis](https://lenis.darkroom.engineering/)                                                 |

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/) (Recommended)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/foodhub-frontend.git
   cd foodhub-frontend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory (refer to `.env.example` if available).

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Project Structure

```text
src/
├── app/            # Next.js App Router (Routes & Pages)
├── components/     # UI Components (Shadcn + Custom)
├── lib/            # Utility functions & Shared logic (Auth client, etc.)
├── store/          # Zustand State Management
├── public/         # Static assets & Images
└── ...
```

---

## 📜 Available Scripts

- `pnpm dev`: Start development server.
- `pnpm build`: Create production build.
- `pnpm start`: Start production server.
- `pnpm lint`: Run ESLint check.

---

## 🌐 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new).

1. Push your code to GitHub/GitLab.
2. Import the project into Vercel.
3. Configure environment variables.
4. Deploy!

---

_Built with `heartfelt dedication` for the lovers of fine food and bold design._
