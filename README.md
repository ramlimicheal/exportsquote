<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 ExportFlow

**AI-Powered Export Quote Management Platform**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5a0fc8)](https://web.dev/progressive-web-apps/)

</div>

---

## ✨ Features

### Core Features
- 📋 **AI Quote Builder** - Create export quotes with natural language processing
- 🛡️ **Margin Shield™** - Real-time margin protection with visual alerts
- 📦 **Container Tetris™** - Smart container utilization optimization
- 👥 **Client Intelligence** - AI-powered risk scoring and recommendations
- 🚢 **Smart Logistics** - Real-time shipment tracking and carrier comparison
- 📄 **Document Automation** - Auto-generate invoices, packing lists, certificates
- 📊 **Analytics Dashboard** - KPIs, trends, and predictive insights

### Pro Features
- ⌨️ **Command Palette** - Quick actions with ⌘K (or Ctrl+K)
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Mobile Optimized** - Responsive design with PWA support
- 🔔 **Smart Notifications** - Real-time updates and alerts
- 📤 **Data Export** - Export to CSV/PDF
- 🎯 **Onboarding Tour** - Guided setup for new users
- ⚡ **Offline Support** - Works without internet (PWA)
- ♿ **Accessible** - WCAG AA compliant

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/exportflow.git
cd exportflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 📁 Project Structure

```
├── components/          # Reusable UI components
│   ├── ChatInterface.tsx    # AI Quote Builder
│   ├── CommandPalette.tsx   # ⌘K quick actions
│   ├── DetailsPanel.tsx     # Right sidebar
│   ├── DirectorySidebar.tsx # Quote list sidebar
│   ├── ErrorBoundary.tsx    # Error handling
│   ├── KeyboardShortcutsModal.tsx
│   ├── MobileNav.tsx        # Mobile navigation
│   ├── NavigationRail.tsx   # Desktop nav
│   ├── OnboardingModal.tsx  # First-time tour
│   └── Toast.tsx            # Notifications
│
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── LogisticsPage.tsx
│   ├── ClientsPage.tsx
│   ├── ReportsPage.tsx
│   ├── DocumentsPage.tsx
│   ├── SettingsPage.tsx
│   └── ProfilePage.tsx
│
├── utils/               # Utility functions
│   └── exportUtils.ts   # CSV/PDF export
│
├── App.tsx              # Main app component
├── types.ts             # TypeScript types
├── constants.ts         # Demo data
├── utils.ts             # Business logic
└── index.tsx            # Entry point
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `?` | Show keyboard shortcuts |
| `⌘D` | Toggle dark mode |
| `G D` | Go to Dashboard |
| `G Q` | Go to Quotes |
| `G P` | Go to Products |
| `G L` | Go to Logistics |
| `G C` | Go to Clients |
| `N` | Create new quote |
| `Esc` | Close modal/Cancel |

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS (CDN)
- **Build:** Vite 6
- **State:** React Hooks (useState, useCallback)
- **Icons:** Material Icons Outlined

### Key Patterns
- **Domain-Driven Design** - Types and business logic separated
- **Callback Props** - Parent-child communication
- **Error Boundaries** - Graceful error handling
- **PWA Ready** - Service worker + manifest

---

## 📊 Data Model

### Core Entities
- `Client` - Company info, risk scoring, payment history
- `Product` - SKU, pricing, dimensions, HS codes
- `Quote` - Line items, incoterms, calculations
- `Shipment` - Tracking, container, milestones
- `Document` - Invoices, certificates, contracts

### Key Calculations
- `calculateCBM()` - Volume from dimensions
- `calculateShipping()` - Freight by incoterm
- `calculateItemMetrics()` - Per-line totals
- `getMarginColor()` - Visual margin indicators

---

## 🔌 API Integration

The app is designed to work with the Gemini API for AI features:

```env
# .env.local
GEMINI_API_KEY=your_api_key_here
```

AI features include:
- Natural language product search
- Smart pricing suggestions
- Risk analysis
- Document generation

---

## 📱 PWA Support

ExportFlow is a Progressive Web App:

- **Installable** - Add to home screen
- **Offline Support** - Works without internet
- **Push Notifications** - Real-time alerts
- **Fast** - Service worker caching

---

## 🎨 Customization

### Colors
Edit `index.html` Tailwind config:
```javascript
colors: {
    primary: "#7C7CE0",
    secondary: "#EA9E82",
    // ...
}
```

### Adding Views
1. Add to `ViewType` in `types.ts`
2. Create page in `pages/`
3. Add route in `App.tsx`
4. Add nav item in `NavigationRail.tsx`

---

## 🧪 Testing

> Note: Test framework not yet configured.

To add testing:
```bash
npm install -D vitest @testing-library/react
```

---

## 📦 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` directory.

### Deploy Options
- **Vercel** - `vercel deploy`
- **Netlify** - Drag & drop `dist/`
- **GitHub Pages** - Push to `gh-pages` branch

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for exporters worldwide**

[Report Bug](https://github.com/yourusername/exportflow/issues) · [Request Feature](https://github.com/yourusername/exportflow/issues)

</div>
