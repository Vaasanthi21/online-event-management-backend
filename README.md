# Online Event Management Platform - Frontend

A comprehensive and interactive solution for organizing and managing virtual events, offering seamless attendee registration, real-time communication, and engagement tools.

## Features

- **User Authentication**: Secure login and registration system
- **Event Discovery**: Browse and search for public events
- **Event Management**: Create, edit, and manage your own events
- **Registration System**: Easy event registration with ticket selection
- **Interactive Dashboard**: View your events and registrations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live announcements and notifications
- **Session Management**: View event schedules and bookmark sessions

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components inspired by ShadCN UI
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-management-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ui/            # Base UI components (Button, Input, Card, etc.)
├── pages/             # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Events.tsx
├── context/           # React Context providers
│   └── AuthContext.tsx
├── services/          # API service functions
│   └── api.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── cn.ts
├── App.tsx            # Main App component with routing
└── main.tsx           # Entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Deployment

This frontend is deployed on Netlify.

**Live URL**: [Your Netlify URL]

## Backend API

The backend API is hosted at: [Your Render URL]

## Login Credentials (Demo)

For testing purposes, you can create an account using the registration page.

## Screenshots

*Screenshots will be added here*

## Video Walkthrough

*Video link will be added here*

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
