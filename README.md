# Gravity Frontend

A modern booking and consultation platform built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Gravity connects users with consultants/companies for appointments, featuring real-time chat, video calls, and wallet-based payments.

## 🚀 Features

- **User Portal**
  - Browse and book consultant slots
  - Real-time chat with consultants
  - Video call integration
  - Wallet balance management
  - Booking history and management
  - Profile management

- **Company Portal**
  - Manage availability slots
  - View and manage bookings
  - Reschedule and cancel bookings
  - Real-time notifications
  - Analytics dashboard
  - Profile and brand management

- **Admin Portal**
  - User and company management
  - Approval workflows
  - System analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Animations**: GSAP, Framer Motion
- **UI Components**: 
  - Lucide React (icons)
  - Heroicons
  - React Icons
- **Charts**: Chart.js, React Chart.js 2
- **Authentication**: 
  - JWT-based auth with cookies
  - Google OAuth integration
- **Forms**: Custom form handling with validation
- **Image Processing**: React Cropper, React Avatar Editor

## 📋 Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

## 📦 Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## 🏃 Getting Started

```bash
# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── Admin/             # Admin portal pages
│   ├── Company/           # Company portal pages
│   ├── User/              # User portal pages
│   ├── VideoCall/         # Video call page
│   ├── Login/             # Login page
│   ├── signup/            # Signup page
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── context/               # React context providers
├── redux/                 # Redux store and slices
├── services/              # API service layer
│   ├── api/               # Axios configuration
│   ├── AuthService.ts     # Authentication API
│   ├── CompanyService.ts  # Company-related API
│   └── ...
├── shared/                # Shared utilities
│   ├── constants/         # Constants and messages
│   ├── enums/             # TypeScript enums
│   └── ...
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🔑 Key Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Automatic token refresh on expiry
- Role-based access control (User, Company, Admin)
- Google OAuth integration

### Booking System
- Real-time slot availability
- Booking management (cancel, reschedule)
- Payment status tracking
- Wallet-based refunds

### Real-time Features
- Socket.io integration for real-time updates
- Live chat between users and companies
- Video call functionality
- Real-time notifications

### UI/UX
- Responsive design for all screen sizes
- Smooth animations with GSAP and Framer Motion
- Toast notifications
- Loading states and error handling

## 🧪 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn about React
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - Learn about TypeScript

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

