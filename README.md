# Real-Time Seating App

A real-time seat information system that helps users check seat availability instantly. This application allows you to monitor and manage seating in shared spaces efficiently.

## Features

- Real-time seat availability monitoring
- Interactive seating map
- Seat reservation system
- Automatic daily seat reset at 21:00
- Density indicator for space utilization

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

## Automatic Seat Reset Configuration

This application includes an automatic seat reset feature that runs daily at 21:00. To configure it:

1. Deploy your application to your preferred hosting provider

2. Add the following secrets to your GitHub repository:
   - Go to `Settings` > `Secrets and variables` > `Actions`
   - Add these secrets:
     - `RESET_API_ENDPOINT`: Your app's URL + `/api/reset-seats` (e.g., `https://your-app.vercel.app/api/reset-seats`)
     - `RESET_API_KEY`: Same key as the one in your `.env.local` file

The GitHub Actions workflow will automatically reset all seats daily at 21:00. You can also trigger the workflow manually from the Actions tab in your repository.
