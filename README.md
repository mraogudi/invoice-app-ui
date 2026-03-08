# Invoice App UI

A modern, feature-rich React-based invoice management application with multi-provider authentication, real-time invoice generation, and comprehensive business management capabilities.

![Language Composition](https://img.shields.io/badge/JavaScript-97.9%25-f7df1e?style=flat-square) ![CSS](https://img.shields.io/badge/CSS-1.4%25-1572b6?style=flat-square) ![Other](https://img.shields.io/badge/Other-0.7%25-555?style=flat-square)

## 🎯 Overview

Invoice App UI is a full-featured invoice management system built with **React**, **Vite**, and **Material-UI**. It provides a complete solution for managing invoices, clients, products, payments, and generating detailed business reports. The application supports multiple authentication methods including Google OAuth, Microsoft Azure, and GitHub integration.

## ✨ Key Features

- **Multi-Provider Authentication**
  - Google OAuth integration
  - Microsoft Azure (MSAL) authentication
  - GitHub OAuth callback support
  - Custom authentication with OTP verification

- **Invoice Management**
  - Create, view, and manage invoices
  - Real-time invoice preview
  - Public invoice sharing
  - Invoice PDF export with QR codes
  - Invoice status tracking

- **Client Management**
  - Add and manage customer information
  - Client database with full CRUD operations
  - Client search and filtering

- **Product Management**
  - Product catalog management
  - Product pricing and descriptions
  - Quick product selection in invoices

- **Payment Tracking**
  - Payment history and records
  - Payment status management
  - Multi-payment method support

- **Reporting & Analytics**
  - Revenue reports and insights
  - Payment analytics
  - Invoice statistics
  - Data visualization with Recharts

- **User Features**
  - Secure user authentication
  - Password change functionality
  - User profile management
  - Session management
  - Protected routes with role-based access

- **UI/UX Features**
  - Responsive Material Design interface
  - Smooth animations with Framer Motion
  - Toast notifications with Notistack
  - Professional dark/light theme support
  - Mobile-friendly layout

## 📁 Project Structure

```
invoice-app-ui/
├── src/
│   ├── api/                    # API integration and endpoints
│   ├── assets/                 # Images, icons, and static assets
│   ├── auth/                   # Authentication context and logic
│   │   └── AuthContext         # Global auth state management
│   ├── components/             # Reusable React components
│   │   └── ProtectedRoute      # Route protection wrapper
│   ├── layouts/                # Layout components
│   │   └── MainLayout          # Main application layout
│   ├── pages/                  # Page components
│   │   ├── Login               # Login page
│   │   ├── Register            # User registration
│   │   ├── VerifyOtp           # OTP verification
│   │   ├── Dashboard           # Main dashboard
│   │   ├── Invoices            # Invoice listing
│   │   ├── CreateInvoice       # Create new invoice
│   │   ├── InvoicePreview      # Invoice preview
│   │   ├── InvoicePublicView   # Public invoice view
│   │   ├── Clients             # Client management
│   │   ├── CreateClient        # Add new client
│   │   ├── Products            # Product management
│   │   ├── Payments            # Payment tracking
│   │   ├── Reports             # Analytics and reports
│   │   ├── Profile             # User profile
│   │   ├── ChangePassword      # Password change
│   │   └── GithubCallback      # GitHub OAuth callback
│   ├── services/               # Business logic and API calls
│   ├── utils/                  # Utility functions and helpers
│   ├── App.jsx                 # Root app component with routing
│   ├── main.jsx                # React DOM entry point
│   ├── index.css               # Global styles
│   └── App.css                 # App component styles
├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint rules
├── Dockerfile                  # Docker containerization
├── nginx.conf                  # Nginx configuration
├── cloudbuild.yaml             # Google Cloud Build configuration
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── .dockerignore                # Docker ignore rules
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **Vite** (v7.2.4) - Build tool and dev server
- **React Router DOM** (v7.13.0) - Client-side routing
- **Material-UI** (v7.3.7) - Component library
- **Framer Motion** (v12.34.0) - Animation library

### Authentication
- **@react-oauth/google** (v0.13.4) - Google OAuth
- **@azure/msal-browser** (v5.2.0) - Microsoft Azure authentication
- **@azure/msal-react** (v5.0.4) - Azure integration
- **@react-oauth/github** (v0.1.0) - GitHub OAuth

### Utilities & Libraries
- **Axios** (v1.13.5) - HTTP client
- **jwt-decode** (v4.0.0) - JWT token decoding
- **Notistack** (v3.0.2) - Toast notifications
- **Recharts** (v3.7.0) - Data visualization
- **html2canvas** (v1.4.1) - Canvas rendering
- **jsPDF** (v4.2.0) - PDF generation
- **qrcode.react** (v4.2.0) - QR code generation
- **dayjs** (v1.11.19) - Date manipulation
- **crypto-js** (v4.2.0) - Encryption
- **lz-string** (v1.5.0) - String compression

### Development Tools
- **ESLint** (v9.39.1) - Code linting
- **Emotion** - CSS-in-JS styling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mraogudi/invoice-app-ui.git
cd invoice-app-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Then configure your `.env` file with:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_API_BASE_URL=http://localhost:8000
```

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 🔐 Authentication Flow

The application uses multiple authentication providers:

### Google OAuth
1. User clicks "Login with Google"
2. Redirects to Google login page
3. Upon success, receives OAuth token
4. Token is stored and used for API calls

### Microsoft Azure (MSAL)
1. User initiates Microsoft login
2. MSAL handles the OAuth flow
3. Token stored in localStorage
4. Automatic token refresh on expiry

### GitHub OAuth
1. User initiates GitHub login
2. Redirected to GitHub authorization
3. Callback handler processes token
4. User session established

### Custom Authentication
1. User registers with email and password
2. OTP verification is sent
3. Upon verification, user can log in
4. JWT token issued for session management

## 📋 Available Routes

### Public Routes
- `/login` - Login page
- `/register` - User registration
- `/verify-otp` - OTP verification
- `/chng-pwd` - Password change
- `/github/callback` - GitHub OAuth callback
- `/invoice/view/:id` - Public invoice view

### Protected Routes (Require Authentication)
- `/` - Dashboard (home page)
- `/invoices` - Invoice listing
- `/create-invoice` - Create new invoice
- `/invoices-preview` - Invoice preview page
- `/clients` - Client management
- `/add-customer` - Add new client
- `/products` - Product management
- `/payments` - Payment history
- `/reports` - Analytics and reports
- `/profile` - User profile
- `/chng-pwd` - Change password

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t invoice-app-ui:latest .
```

### Run Docker Container

```bash
docker run -p 80:80 invoice-app-ui:latest
```

The application will be available at `http://localhost`

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  invoice-app-ui:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://api:8000
```

## ☁️ Cloud Deployment

### Google Cloud Run

The project includes a `cloudbuild.yaml` configuration for automatic deployment to Google Cloud Run:

```bash
gcloud builds submit
```

The build process:
1. Builds the React application with Vite
2. Creates a Docker image with Nginx
3. Pushes to Google Container Registry
4. Deploys to Cloud Run

## 🔧 Configuration Files

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Vite configuration for React development and production builds.

### Dockerfile

Two-stage Docker build:
1. **Build Stage**: Node.js (v20-alpine)
   - Installs dependencies
   - Builds the React app with Vite

2. **Runtime Stage**: Nginx (alpine)
   - Serves the built application
   - Uses custom Nginx configuration

### nginx.conf

Nginx server configuration for serving the React SPA with:
- Gzip compression enabled
- Proper caching headers
- SPA routing support (rewrites to index.html)
- Security headers

## 📝 API Integration

The application communicates with a backend API using Axios. Key features:

- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Authentication**: JWT tokens included in request headers
- **Request/Response Interceptors**: Automatic error handling and token refresh
- **Endpoints**: Located in `src/api/` directory

Example API calls from services:
- User authentication
- Invoice CRUD operations
- Client management
- Product management
- Payment tracking
- Report generation

## 🎨 Styling & Theming

The application uses:

- **Material-UI (MUI)** for component styling
- **Emotion** for CSS-in-JS
- **Custom CSS** for specific components
- **Responsive Design** using CSS media queries
- **Dark/Light Theme** support (if configured)

Global styles defined in `src/index.css` and component-specific styles in `src/App.css`.

## 📦 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Mraogudi**
- GitHub: [@mraogudi](https://github.com/mraogudi)
- Repository: [invoice-app-ui](https://github.com/mraogudi/invoice-app-ui)

## 🙏 Acknowledgments

- React team for the amazing framework
- Material-UI for beautiful components
- Vite for blazing fast build tool
- All contributors and users of this project

## 📞 Support

For issues, feature requests, or questions:
1. Open an [Issue](https://github.com/mraogudi/invoice-app-ui/issues)
2. Check existing documentation
3. Review the implementation plan

## 🔗 Related Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Material-UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)

---

**Last Updated**: 2026-03-08
