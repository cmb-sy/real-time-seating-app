# Real-Time Seating App

A real-time seat information system that helps users check seat availability instantly. This application allows you to monitor and manage seating in shared spaces efficiently.

<img width="709" alt="SS 2025-06-12 22 12 25" src="https://github.com/user-attachments/assets/7a978d82-661c-4ff6-a50d-b3cc0223a67d" />

## Features

- Real-time seat availability monitoring
- Interactive seating map
- Seat reservation system
- Automatic daily seat reset at 21:00
- Density indicator for space utilization
- Basic authentication for access control
- Contact form using SSGform service
- **Smart API Endpoint Detection**: Automatic fallback between local and production APIs

## API Endpoint Management

This application includes intelligent API endpoint detection that automatically switches between local development and production environments:

### How It Works

1. **Local Development Priority**: When running the analytics page, the app first tries to connect to the local backend server at `http://localhost:8000`
2. **Automatic Fallback**: If the local server is not available, it automatically falls back to the production API endpoints
3. **Visual Status Indicator**: The header shows the current connection status:
4. **Manual Toggle**: Users can manually switch between local and production endpoints using the toggle button

### Backend Server Setup

#### Local Development

To run the local backend server:

```bash
# Navigate to your backend directory
cd path/to/your/backend

# Start the FastAPI server on port 8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The frontend will automatically detect and connect to `http://localhost:8000/api/predictions/*` endpoints.

#### Production

The production API endpoints are served from the same domain as the frontend:

- `/api/predictions/weekly`
- `/api/predictions/weekly-averages`

## Automatic Seat Reset Configuration

This application includes an automatic seat reset feature that runs daily at 21:00:

1. Deploy your application to your preferred hosting provider

2. Add the following secrets to your GitHub repository:
   - Go to `Settings` > `Secrets and variables` > `Actions`
   - Add these secrets:
     - `RESET_API_ENDPOINT`: Your app's URL + `/api/reset-seats` (e.g., `https://your-app.vercel.app/api/reset-seats`)
     - `RESET_API_KEY`: Same key as the one in your `.env.local` file

The GitHub Actions workflow will automatically reset all seats daily at 21:00. You can also trigger the workflow manually from the Actions tab in your repository.

## Backend

https://github.com/cmb-sy/real-time-seating-app-ML
