/**
 * VIVIAN MUGURE — PORTFOLIO BACKEND
 * Node.js & Express Contact Form Handler
 * v1.0 — Security-First & Production-Ready
 */

const path = require('path');
// Load Environment Variables from root
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const dns = require('dns');

// Force Node.js to use a reliable DNS server to avoid ETIMEOUT errors
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve Static Frontend Files (Ultimate fix for the "file://" security block)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rate Limiting — Security for the contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    standardHeaders: 'draft-7', // set common rate limit headers
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again after 15 minutes.' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Transporter Setup
// NOTE: For Gmail, you MUST use an "App Password" (2FA enabled)
// Transporter Setup
// Explicit Gmail settings to help with DNS/Network timeouts
// Transporter Setup
// Explicit Gmail settings to help with DNS/Network timeouts
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim()
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('✅ Server is ready to take messages');
    }
});

/**
 * @route   POST /contact
 * @desc    Receive contact form data and send email
 */
app.post('/contact', contactLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: '⚠️ Missing required fields: Name, Email, and Message are mandatory.' 
        });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: '⚠️ Invalid email format.'
        });
    }

    try {
        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Sent via your own email to avoid being flagged as spam
            to: process.env.ADMIN_EMAIL || 'vivianmugure36@gmail.com',
            replyTo: email, // Direct reply to the user's email
            subject: `New Portfolio Message: ${subject || 'General Inquiry'}`,
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #1a1a2e; background-color: #f6f6fc; border-radius: 12px; border: 1px solid #e0e0f0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #6355e0; margin: 0; font-size: 24px;">New Inquiry Received</h1>
                        <p style="color: #7171a5; margin: 5px 0 0;">from your professional portfolio</p>
                    </div>
                    
                    <div style="background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                        <p style="margin: 0 0 10px; font-weight: bold; color: #6355e0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Sender Details</p>
                        <p style="margin: 5px 0;"><strong style="color: #4a4a6e;">Name:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong style="color: #4a4a6e;">Email:</strong> <a href="mailto:${email}" style="color: #6355e0; text-decoration: none;">${email}</a></p>
                        <p style="margin: 5px 0;"><strong style="color: #4a4a6e;">Subject:</strong> ${subject || 'No subject provided'}</p>
                        
                        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #f0f0f5;">
                            <p style="margin: 0 0 10px; font-weight: bold; color: #6355e0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Message Content</p>
                            <p style="line-height: 1.7; color: #2d2d4d; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; color: #9a9ab8; font-size: 12px;">
                        <p>This message was securely sent via your portfolio's backend service.</p>
                        <p>&copy; 2026 Vivian Mugure Portfolio</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent from ${name} (${email})`);
        
        res.status(200).json({
            success: true,
            message: '🚀 Your message has been sent successfully! I will get back to you shortly.'
        });
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        res.status(500).json({
            success: false,
            message: '😔 Oops! Something went wrong on our end. Please try again later or email me directly at vivianmugure36@gmail.com.'
        });
    }
});

// Serving static files from root (for local preview)
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// START SERVER (Local only)
// This will start the server locally but won't be used by Vercel's serverless engine
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Dedicated Server started locally on port ${PORT}`);
        console.log(`   Press Ctrl+C to stop it.`);
    });
}

module.exports = app;
