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
