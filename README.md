[README.md](https://github.com/user-attachments/files/26460991/README.md)
# Vivian Mugure — Professional Portfolio

A modern, high-performance personal portfolio for a Web Developer. Built with a focus on aesthetics, responsiveness, and functional backend integration.

## 🚀 Key Features
- **Modern Dark UI**: Features glassmorphism and smooth scroll animations.
- **Full-Stack Contact**: Integrated Node.js backend with Nodemailer and Gmail SMTP.
- **Dynamic SEO**: Optimized meta tags and semantic HTML for visibility.
- **Performance**: High Lighthouse scores for speed and accessibility.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Communication**: Nodemailer, Google SMTP
- **Deployment**: Vercel & GitHub Actions

## 📦 Getting Started
1. Clone the repository: `git clone https://github.com/vivi-m/vivian-mugure-portfolio.git`
2. Install dependencies: `cd backend && npm install`
3. Configure `.env` using `.env.example`.
4. Run locally: `node server.js`
- **/frontend**: Modern, responsive website built with HTML5, CSS3, and JavaScript.
- **/backend**: Secure Node.js server powered by Express and Nodemailer.

---


To get the full stack experience running on your local machine, follow these steps:

### 1. Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Backend Configuration
1.  Navigate to the `backend` folder.
2.  Duplicate `.env.example` and rename the copy to `.env`.
3.  Open `.env` and configure your credentials:
    - **EMAIL_USER**: Set this to `vivianmugure36@gmail.com`.
    - **EMAIL_PASS**: Enter your **Gmail App Password**.
      - *Note: For security, Gmail requires an [App Password](https://support.google.com/accounts/answer/185833). Make sure 2FA is enabled on your Google account first.*

### 3. Install Dependencies
Open your terminal (Command Prompt, PowerShell, or Bash) and run:
```bash
cd backend
npm install
```

### 4. Run the Backend Server
Once dependencies are installed, start the server:
```bash
node server.js
```
The server will start at `http://localhost:5000`. You should see a message saying "✅ Server is ready to take messages".

### 5. Launch the Frontend
1.  Open `frontend/index.html` in any web browser.
2.  Navigate to the contact form at the bottom.
3.  Fill in your details and click **Send Message**.
4.  *Ensure the backend server is running in the background for the form to work.*

---

## 🛠️ Technical Features
- **Backend API**: RESTful POST endpoint at `/contact` to receive visitor inquiries.
- **Security**: 
  - **Environment Variables**: Sensitive data is stored in `.env`.
  - **CORS**: Configured for secure cross-origin requests.
  - **Input Sanitization**: Prevents XSS attacks.
  - **Rate Limiting**: Protects your inbox from spam bots by limiting submissions.
- **Email Delivery**: Uses **Nodemailer** with a professional HTML email template that includes sender details and formatted message content.
- **Frontend Feedback**: Smooth loading animations and clear success/error status messages with premium glassmorphism styling.

---

## 🏗️ Requirements Checklist
- [x] Node.js Backend with Express
- [x] API Endpoint (/contact)
- [x] Nodemailer Integration
- [x] Sent to: vivianmugure36@gmail.com
- [x] Frontend Fetch API Connection
- [x] Success/Error Handling
- [x] Organized Project Structure
- [x] Clear Run Instructions
