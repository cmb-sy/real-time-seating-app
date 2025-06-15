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
   - 🟢 **ローカル接続** (Local Connection): Connected to local development server
   - 🔵 **本番接続** (Production Connection): Connected to production server
   - 🔴 **接続失敗** (Connection Failed): No servers available
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

- `/api/predictions/today-tomorrow`
- `/api/predictions/weekly-average`

### API Endpoints

The application expects the following API endpoints:

1. **Today/Tomorrow Predictions**: `GET /api/predictions/today-tomorrow`

   ```json
   {
     "success": true,
     "data": {
       "today": {
         "date": "2024-01-15",
         "day_of_week": "月",
         "occupancy_rate": 0.65,
         "available_seats": 35
       },
       "tomorrow": {
         "date": "2024-01-16",
         "day_of_week": "火",
         "occupancy_rate": 0.75,
         "available_seats": 25
       }
     }
   }
   ```

2. **Weekly Averages**: `GET /api/predictions/weekly-average`
   ```json
   {
     "success": true,
     "data": {
       "weekly_averages": [
         {
           "weekday": 0,
           "weekday_name": "月曜",
           "occupancy_rate": 0.65,
           "available_seats": 35
         }
       ]
     }
   }
   ```

### Troubleshooting

If you see **接続失敗** (Connection Failed):

1. **Check Local Server**: Ensure your local backend is running on port 8000
2. **Check Network**: Verify network connectivity
3. **Check Console**: Open browser dev tools to see detailed error messages
4. **Manual Retry**: Use the "再接続を試行" (Retry Connection) button

## Requirements

- Node.js (version 16 or above)
- npm or yarn
- Supabase account

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/real-time-seating-app.git
   cd real-time-seating-app
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESET_API_KEY=your_reset_api_key
   AUTH_USERNAME=your_auth_username
   AUTH_PASSWORD_HASH=your_bcrypt_hashed_password
   ```

4. Set up Supabase:

   - Create a new Supabase project
   - Configure the necessary tables and authentication settings
   - Run the migrations in the `supabase/migrations` directory

5. Start the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

6. Access the application at http://localhost:3000

## Basic Authentication

The application includes Basic authentication:

- Password hash should be generated using bcrypt
- Default username can be changed in settings
- Authentication credentials are managed via environment variables

## Contact Form

The contact form uses [SSGform](https://ssgform.com/):

- No complex email setup required
- Spam filter protection included
- High delivery reliability

For detailed information, refer to the SSGform integration documentation.

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
