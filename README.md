**SmartBookmark**

A modern, real-time bookmark manager built with **Next.js (App Router)** and **Supabase**.

🔗 Live Demo: https://smart-bookmark-eight.vercel.app

📂 GitHub Repository: https://github.com/divya9500/smart-bookmark

**✨Features**

🔐 Google OAuth Authentication

➕ Add Bookmarks

✏️ Edit Bookmarks

🗑️ Delete Bookmarks

🔄 Real-time updates across tabs

🔒 Row Level Security (Users see only their data)

📱 Fully Responsive UI

🌐 Automatic Favicon Preview

🔔 Toast Notifications

📊 Sorting (Newest / Oldest)

🚀 Deployed on Vercel

**🛠 Tech Stack**

* Next.js (App Router)

* Supabase (Auth + Database + Realtime)

* PostgreSQL

* Tailwind CSS

* React Hot Toast

* Vercel

**🔐 Authentication & Security**

* Google OAuth via Supabase

* Secure session handling

* Row Level Security (RLS) enabled

* User-specific data isolation

**⚙️ Environment Variables**

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://qqcbqtyihpzrttntoqwl.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ok_EiVflW0n65I3JxXP4xA_6G8dqCRN

**🧪 Run Locally**

git clone https://github.com/divya9500/smart-bookmark.git

cd smart-bookmark

npm install

npm run dev

Visit:

http://localhost:3000

**🚀 Deployment**

* Deployed on Vercel with environment variables configured.

* Google OAuth configured in:

  -Google Cloud Console
  
  -Supabase Authentication → Google Provider

**🧩 Challenges & Solutions**
 
* OAuth 401 deleted_client

  - Recreated OAuth client and updated credentials in Supabase.
  
* 500 unexpected_failure

  - Fixed incorrect redirect URI configuration.
  
* Realtime not updating

 - Enabled Supabase Realtime replication and correct subscription setup.

**📈 Future Improvements**

* Bookmark categories

* Search feature

* Tag system

* Dark mode

* Drag & drop ordering

**👨‍💻 Author**

Divya Govindhan

GitHub: https://github.com/divya9500

**🎯 Project Highlights**

* This project demonstrates:

* Authentication integration

* Real-time database updates

* Secure data access with RLS

* Production deployment

* OAuth debugging & configuration

* Clean responsive UI design
  
