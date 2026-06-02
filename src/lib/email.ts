// src/lib/email.ts
import nodemailer from 'nodemailer'

// Create reusable transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
})

export async function sendOrderNotification(
    to: string,
    orderDetails: {
        orderId: string
        productName: string
        quantity: number
        totalAmount: number
        buyerName: string
        buyerPhone: string
        buyerEmail: string
        buyerAddress: string
    }
) {
    const mailOptions = {
        from: `"Hookit" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: `🛒 New Order #${orderDetails.orderId.slice(0, 8).toUpperCase()} - ${orderDetails.productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1a1a1a; color: white; padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">🛒 New Order Received!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.8;">From Hookit</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Order Details</h2>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderDetails.orderId.slice(0, 12).toUpperCase()}</p>
                        <p style="margin: 8px 0;"><strong>Product:</strong> ${orderDetails.productName}</p>
                        <p style="margin: 8px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                        <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Buyer Details</h2>
                        <p style="margin: 8px 0;"><strong>Name:</strong> ${orderDetails.buyerName}</p>
                        <p style="margin: 8px 0;"><strong>Phone:</strong> ${orderDetails.buyerPhone}</p>
                        <p style="margin: 8px 0;"><strong>Email:</strong> ${orderDetails.buyerEmail || 'Not provided'}</p>
                        <p style="margin: 8px 0;"><strong>Address:</strong> ${orderDetails.buyerAddress}</p>
                    </div>
                    
                    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; color: #2e7d32; font-weight: 600;">
                            ✅ Please contact the buyer to confirm the order
                        </p>
                        <a href="https://wa.me/${orderDetails.buyerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(orderDetails.buyerName)},%20I%20received%20your%20order%20#${orderDetails.orderId.slice(0, 8)}.%20Can%20you%20confirm?"
                           style="display: inline-block; margin-top: 15px; padding: 12px 24px; background: #25d366; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                            📱 Contact Buyer on WhatsApp
                        </a>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                        This is an automated notification from Hookit.<br>
                        You can manage your orders at https://yourdomain.com/seller/orders
                    </p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

export async function sendBuyerConfirmation(
    to: string,
    orderDetails: {
        orderId: string
        productName: string
        quantity: number
        totalAmount: number
        sellerName: string
        sellerPhone: string
        sellerWhatsapp: string
    }
) {
    const mailOptions = {
        from: `"Hookit" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: `✅ Order Confirmed #${orderDetails.orderId.slice(0, 8).toUpperCase()} - ${orderDetails.productName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1a1a1a; color: white; padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.8;">Thank you for shopping with Hookit</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Order Summary</h2>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderDetails.orderId.slice(0, 12).toUpperCase()}</p>
                        <p style="margin: 8px 0;"><strong>Product:</strong> ${orderDetails.productName}</p>
                        <p style="margin: 8px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                        <p style="margin: 8px 0;"><strong>Total:</strong> ₹${orderDetails.totalAmount}</p>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center;">
                        <p style="margin: 0; color: #e65100; font-weight: 600;">
                            📱 The seller will contact you on Email for order updates
                        </p>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                        Questions? Reply to this email or contact the seller directly.
                    </p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

// ✅ NEW FUNCTION: Send order status update email to buyer
export async function sendStatusUpdateEmail(
    to: string,
    orderDetails: {
        orderId: string
        productName: string
        quantity: number
        totalAmount: number
        status: string
        sellerName: string
        sellerPhone: string
        buyerName: string
    }
) {
    // Status-specific styling and messages
    const statusConfig: Record<string, { color: string; bgColor: string; emoji: string; message: string; title: string }> = {
        pending: {
            color: '#f59e0b',
            bgColor: '#fef3c7',
            emoji: '⏳',
            message: 'Your order has been received and is pending confirmation.',
            title: 'Order Pending'
        },
        processing: {
            color: '#3b82f6',
            bgColor: '#dbeafe',
            emoji: '🔧',
            message: 'Your order is being prepared and processed.',
            title: 'Order Processing'
        },
        shipped: {
            color: '#7c3aed',
            bgColor: '#ede9fe',
            emoji: '📦',
            message: 'Your order has been shipped and is on its way!',
            title: 'Order Shipped'
        },
        delivered: {
            color: '#10b981',
            bgColor: '#d1fae5',
            emoji: '✅',
            message: 'Your order has been delivered. Enjoy your purchase!',
            title: 'Order Delivered'
        },
        completed: {
            color: '#059669',
            bgColor: '#d1fae5',
            emoji: '🎉',
            message: 'Your order is complete! Thank you for shopping with us.',
            title: 'Order Completed'
        },
        cancelled: {
            color: '#ef4444',
            bgColor: '#fee2e2',
            emoji: '❌',
            message: 'Your order has been cancelled. Contact the seller for more details.',
            title: 'Order Cancelled'
        }
    }

    const config = statusConfig[orderDetails.status] || statusConfig.pending

    const mailOptions = {
        from: `"Hookit" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: `${config.emoji} ${config.title} - Order #${orderDetails.orderId.slice(0, 8).toUpperCase()}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1a1a1a; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">${config.emoji}</div>
                    <h1 style="margin: 0; font-size: 24px;">${config.title}</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.8;">Order #${orderDetails.orderId.slice(0, 8).toUpperCase()}</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
                    <!-- Status Banner -->
                    <div style="background: ${config.bgColor}; border: 2px solid ${config.color}; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                        <p style="margin: 0; color: ${config.color}; font-size: 18px; font-weight: 700; text-transform: uppercase;">
                            ${orderDetails.status}
                        </p>
                        <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">
                            ${config.message}
                        </p>
                    </div>
                    
                    <!-- Order Details -->
                    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">📦 Order Details</h2>
                        <p style="margin: 8px 0;"><strong>Order ID:</strong> #${orderDetails.orderId.slice(0, 12).toUpperCase()}</p>
                        <p style="margin: 8px 0;"><strong>Product:</strong> ${orderDetails.productName}</p>
                        <p style="margin: 8px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                        <p style="margin: 8px 0;"><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
                    </div>
                                        
                    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                        This is an automated status update from Hookit.<br>
                        You can view your order at https://hookit.online/order/success
                    </p>

                    <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                        Questions? Reply to this email or contact the seller directly.
                    </p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}