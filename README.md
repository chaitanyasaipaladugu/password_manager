# 🔐 PasswordLock - Secure Password Manager

A modern, secure password manager built with React and Supabase that helps you store, manage, and generate strong passwords with client-side encryption.

## ✨ Features

- **🔒 Secure Storage**: Passwords are encrypted using AES encryption before being stored in the database
- **🔑 Password Generation**: Built-in secure password generator with customizable complexity
- **👤 User Authentication**: Complete user registration, login, and email verification system
- **🔍 Search & Filter**: Quick search through your saved passwords
- **✏️ CRUD Operations**: Add, edit, delete, and view your password entries
- **📋 One-Click Copy**: Copy usernames and passwords to clipboard with a single click
- **👁️ Password Visibility**: Toggle password visibility for easy verification
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🌐 Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **State Management**: Redux Toolkit
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **Encryption**: CryptoJS (AES encryption)
- **Styling**: CSS3 with modern features
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd password_manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new project at [Supabase](https://supabase.com)
   - Create a `passwords` table with the following structure:
     ```sql
     CREATE TABLE passwords (
       id BIGSERIAL PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       sitename TEXT NOT NULL,
       url TEXT NOT NULL,
       username TEXT NOT NULL,
       password TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
   - Enable Row Level Security (RLS) and create policies for user access
   - Update `src/supabase/client.js` with your Supabase URL and anon key

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Supabase Setup

1. **Database Table Creation**:

   ```sql
   -- Create passwords table
   CREATE TABLE passwords (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     sitename TEXT NOT NULL,
     url TEXT NOT NULL,
     username TEXT NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

   -- Create policy for users to only access their own passwords
   CREATE POLICY "Users can view their own passwords" ON passwords
     FOR ALL USING (auth.uid() = user_id);
   ```

2. **Authentication Settings**:
   - Enable email confirmation in Supabase Auth settings
   - Configure your site URL for email redirects

### Environment Variables

Update `src/supabase/client.js` with your Supabase credentials:

```javascript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

## 📋 Usage

### Getting Started

1. **Register**: Create a new account with your email
2. **Verify Email**: Check your email and click the verification link
3. **Login**: Access your secure password vault
4. **Add Passwords**: Use the + button to add new password entries
5. **Manage**: Edit, delete, or search through your passwords

### Password Generator

- Click "Generate" when adding/editing a password
- Creates 16-character passwords with uppercase, lowercase, numbers, and symbols
- Automatically ensures strong password complexity

### Security Features

- All passwords are encrypted client-side using AES encryption
- Only encrypted data is stored in the database
- User authentication handled by Supabase Auth
- Row-level security ensures users only access their own data

## 🗂️ Project Structure

```
src/
├── app/
│   └── store.js                 # Redux store configuration
├── components/
│   ├── PasswordCard.jsx         # Individual password entry display
│   └── PasswordForm.jsx         # Add/edit password form
├── features/
│   └── (unused in current structure)
├── redux/
│   └── passwordsSlice.js        # Redux slice for password management
├── supabase/
│   └── client.js               # Supabase client configuration
├── utils/
│   └── (utility functions)
├── App.jsx                     # Main application component
├── Landing.jsx                 # Landing page component
├── Login.jsx                   # Login component
├── Signup.jsx                  # Registration component
├── VerificationPage.jsx        # Email verification component
├── App.css                     # Main styles
└── index.js                    # Application entry point
```

## 🔐 Security Considerations

- **Encryption**: Passwords are encrypted using AES encryption before storage
- **Master Key**: Currently uses a hardcoded key (update `masterKey` in `passwordsSlice.js` for production)
- **Authentication**: Secure user authentication via Supabase
- **Database Security**: Row-level security ensures data isolation
- **HTTPS**: Always use HTTPS in production

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel, Netlify, or similar

1. Build the project
2. Deploy the `build` folder
3. Configure environment variables for production
4. Ensure Supabase project is configured for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Important Notes

- **Security**: This is a demo application. For production use, implement additional security measures
- **Master Key**: Replace the hardcoded encryption key with a user-specific key or key derivation
- **Backup**: Always backup your password data
- **Updates**: Keep dependencies updated for security patches

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**

   - Verify your Supabase URL and keys in `client.js`
   - Check if your database table exists and has correct permissions

2. **Email Verification Not Working**

   - Check Supabase Auth settings
   - Verify site URL configuration
   - Check spam folder for verification emails

3. **Passwords Not Saving**
   - Ensure database table has correct schema
   - Check browser console for errors
   - Verify user is authenticated

## 📞 Support

For support, create an issue in the repository or contact the development team.

---

**Built with ❤️ using React and Supabase**
