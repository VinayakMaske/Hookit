// src/lib/hooker-email.ts
import nodemailer from 'nodemailer'

// Reuse the same transporter (same Gmail credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export async function sendHookerResetEmail({
    to,
    resetUrl,
}: {
    to: string
    resetUrl: string
}) {
    const mailOptions = {
        from: `"Hookit" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Reset Your Hookit Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Password Reset</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Hookit Creator Account</p>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0 0 15px 0; color: #666;">
                            We received a request to reset your password. Click the button below to set a new password:
                        </p>
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                Reset Password
                            </a>
                        </div>
                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                            Or copy and paste this link in your browser:
                        </p>
                        <p style="margin: 0; color: #9333ea; font-size: 13px; word-break: break-all;">
                            ${resetUrl}
                        </p>
                    </div>
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            <strong>This link expires in 1 hour.</strong><br>
                            If you didn't request this, you can safely ignore this email.
                        </p>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                        Need help? Contact us at storeapp2026@gmail.com
                    </p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}