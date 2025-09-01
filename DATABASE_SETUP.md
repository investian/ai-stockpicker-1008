# Database Setup Guide

## Phase 1: Supabase Project Setup

1. **Create New Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be created

2. **Get Project Credentials**
   - Navigate to Settings → API
   - Copy your Project URL and anon/public key
   - Update your `.env` file:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

## Phase 2: Database Schema Setup

1. **Run Migration**
   - The migration file `create_auth_tables.sql` will create:
     - `users` table for user profiles
     - `user_sessions` table for session management
     - `portfolio_holdings` table for portfolio data
     - All necessary RLS policies and indexes

2. **Verify Tables Created**
   ```sql
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('users', 'user_sessions', 'portfolio_holdings');
   ```

## Phase 3: Sample Data Population

1. **Create Test User and Portfolio Data**
   ```sql
   -- This will be done automatically when users sign up
   -- Sample data is created via the create_sample_portfolio_data() function
   ```

## Phase 4: Authentication Configuration

1. **Configure Supabase Auth**
   - Go to Authentication → Settings in Supabase dashboard
   - Set Site URL to your domain
   - Configure email templates if needed
   - Ensure email confirmation is enabled

2. **Test Authentication**
   - Try signing up with a test email
   - Verify email confirmation works
   - Test sign in functionality

## Database Schema Details

### Users Table
- `id` (uuid, primary key)
- `email` (text, unique, not null)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### User Sessions Table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `session_token` (text, unique)
- `expires_at` (timestamptz)
- `created_at` (timestamptz)

### Portfolio Holdings Table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `stock_symbol` (text)
- `company_name` (text)
- `shares` (integer)
- `purchase_price` (decimal)
- `current_price` (decimal)
- `quarter` (text)
- `year` (integer)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security Features

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Policies enforce data isolation

2. **Data Validation**
   - Check constraints on numeric fields
   - Foreign key relationships maintained
   - Input validation at application level

## Performance Optimizations

1. **Indexes**
   - Composite index on user_id, quarter, year
   - Index on stock_symbol for fast lookups
   - Session token index for quick validation

2. **Functions**
   - Optimized portfolio summary calculations
   - Efficient data aggregation queries
   - Automatic sample data generation

## Real-time Features

- Real-time subscriptions for portfolio updates
- Automatic UI updates when data changes
- Connection status monitoring
- Graceful error handling

## Testing Checklist

- [ ] User registration works
- [ ] Email verification functions
- [ ] User login successful
- [ ] Portfolio data loads correctly
- [ ] Real-time updates work
- [ ] RLS policies enforce security
- [ ] Performance is acceptable
- [ ] Error handling works properly