// src/app/api/admin/delete-request/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            storeId,
            storeName,
            storeSlug,
            sellerEmail,
            sellerName,
            sellerPhone,
            sellerId,
            requestedAt,
        } = body

        // Format date
        const requestDate = new Date(requestedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        // Admin email content
        const adminMailOptions = {
            from: `"Hookit System" <${process.env.EMAIL_FROM}>`,
            to: process.env.ADMIN_EMAIL || 'storeapp2026@gmail.com', // Your admin email
            subject: `🚨 Store Deletion Request - ${storeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #ef4444; color: white; padding: 30px; border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0; font-size: 24px;">🚨 Store Deletion Request</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Action required within 48 hours</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
                            <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Store Details</h2>
                            <p style="margin: 8px 0;"><strong>Store Name:</strong> ${storeName}</p>
                            <p style="margin: 8px 0;"><strong>Store ID:</strong> ${storeId}</p>
                            <p style="margin: 8px 0;"><strong>Store URL:</strong> <a href="https://hookit.online/store/${storeSlug}">hookit.online/store/${storeSlug}</a></p>
                            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">DEACTIVATED</span></p>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Seller Details</h2>
                            <p style="margin: 8px 0;"><strong>Name:</strong> ${sellerName}</p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> ${sellerEmail}</p>
                            <p style="margin: 8px 0;"><strong>Phone:</strong> ${sellerPhone || 'N/A'}</p>
                            <p style="margin: 8px 0;"><strong>User ID:</strong> ${sellerId}</p>
                        </div>

                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Request Info</h2>
                            <p style="margin: 8px 0;"><strong>Requested At:</strong> ${requestDate}</p>
                            <p style="margin: 8px 0;"><strong>Delete By:</strong> ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
                            <p style="margin: 0; color: #92400e; font-weight: 600;">
                                ⚠️ Review this request in the admin dashboard
                            </p>
                            <a href="https://hookit.online/admin/sellers" 
                               style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: #7C3AED; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                                Go to Admin Dashboard
                            </a>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                            This is an automated notification from Hookit.<br>
                            Admin Panel: https://hookit.online/admin
                        </p>
                    </div>
                </div>
            `,
        }

        await transporter.sendMail(adminMailOptions)

        // Also send confirmation to seller
        const sellerMailOptions = {
            from: `"Hookit" <${process.env.EMAIL_FROM}>`,
            to: sellerEmail,
            subject: `Store Deactivation Request Received - ${storeName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #7C3AED; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Store Deactivation Request</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">We're processing your request</p>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 48px;">⏰</p>
                            <h2 style="margin: 10px 0 0 0; color: #1a1a1a; font-size: 20px;">Your store will be deleted within 48 hours</h2>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">What happens next?</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #666;">
                                <li style="margin-bottom: 8px;">Your store is now <strong>hidden</strong> from all buyers</li>
                                <li style="margin-bottom: 8px;">All your products are no longer visible</li>
                                <li style="margin-bottom: 8px;">Our team will review and permanently delete your data within 48 hours</li>
                                <li>You'll receive a confirmation email once deletion is complete</li>
                            </ul>
                        </div>

                        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
                            <p style="margin: 0; color: #e65100; font-weight: 600;">
                                Changed your mind?
                            </p>
                            <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">
                                Contact us immediately at support@hookit.online
                            </p>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                            Store: ${storeName}<br>
                            Requested: ${requestDate}
                        </p>
                    </div>
                </div>
            `,
        }

        await transporter.sendMail(sellerMailOptions)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Delete request email error:', error)
        return NextResponse.json(
            { error: 'Failed to send notification: ' + error.message },
            { status: 500 }
        )
    }
}