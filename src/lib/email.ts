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
        buyerName?: string
        buyerAddress?: string
        buyerPhone?: string
    }
) {
    const orderDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const orderTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    })

    const subtotal = orderDetails.totalAmount
    const platformFee = Math.round(subtotal * 0.015)
    const total = subtotal

    const mailOptions = {
        from: `"Hookit" <${process.env.EMAIL_FROM}>`,
        to: to,
        subject: `✅ Order Confirmed + Invoice #${orderDetails.orderId.slice(0, 8).toUpperCase()} - ${orderDetails.productName}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                
                <!-- Header -->
                <div style="background: #7C3AED; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700;">✅ Order Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Thank you for shopping with Hookit</p>
                </div>
                
                <div style="background: white; padding: 30px;">
                    
                    <!-- Order Info -->
                    <div style="background: #f8f7fb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
                                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 700; color: #1a1a1a;">#${orderDetails.orderId.slice(0, 12).toUpperCase()}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #1a1a1a;">${orderDate} • ${orderTime}</p>
                            </div>
                        </div>
                    </div>

                    <!-- E-INVOICE SECTION -->
                    <div style="border: 2px solid #7C3AED; border-radius: 12px; overflow: hidden; margin-bottom: 25px;">
                        <!-- Invoice Header -->
                        <div style="background: #7C3AED; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <p style="margin: 0; font-size: 12px; opacity: 0.9;">TAX INVOICE</p>
                                <p style="margin: 2px 0 0 0; font-size: 18px; font-weight: 700;">E-Invoice</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-size: 20px; font-weight: 700;">Hookit</p>
                                <p style="margin: 2px 0 0 0; font-size: 11px; opacity: 0.9;">hookit.online</p>
                            </div>
                        </div>

                        <!-- Invoice Body -->
                        <div style="padding: 20px;">
                            <!-- Seller & Buyer Info -->
                            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                                <div style="flex: 1;">
                                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Sold By</p>
                                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${orderDetails.sellerName}</p>
                                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Phone: ${orderDetails.sellerPhone || 'N/A'}</p>
                                </div>
                                <div style="flex: 1;">
                                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Bill To</p>
                                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${orderDetails.buyerName || 'Customer'}</p>
                                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${orderDetails.buyerPhone || ''}</p>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #666; line-height: 1.4;">${orderDetails.buyerAddress || ''}</p>
                                </div>
                            </div>

                            <!-- Items Table -->
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background: #f8f7fb;">
                                        <th style="padding: 12px; text-align: left; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e5e5;">Item</th>
                                        <th style="padding: 12px; text-align: center; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e5e5;">Qty</th>
                                        <th style="padding: 12px; text-align: right; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e5e5;">Price</th>
                                        <th style="padding: 12px; text-align: right; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e5e5e5;">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding: 12px; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #f0f0f0;">
                                            <p style="margin: 0; font-weight: 600;">${orderDetails.productName}</p>
                                            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Product ID: ${orderDetails.orderId.slice(0, 8)}</p>
                                        </td>
                                        <td style="padding: 12px; text-align: center; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #f0f0f0;">${orderDetails.quantity}</td>
                                        <td style="padding: 12px; text-align: right; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #f0f0f0;">₹${Math.round(orderDetails.totalAmount / orderDetails.quantity)}</td>
                                        <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #f0f0f0;">₹${subtotal}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Totals -->
                            <div style="background: #f8f7fb; padding: 20px; border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: #666;">Subtotal</span>
                                    <span style="font-size: 14px; color: #1a1a1a;">₹${subtotal}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: #666;">Payment Processing Fee (1.5%)</span>
                                    <span style="font-size: 14px; color: #666;">₹${platformFee}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: #666;">Shipping</span>
                                    <span style="font-size: 14px; color: #10b981;">Free</span>
                                </div>
                                <div style="border-top: 2px solid #7C3AED; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
                                    <span style="font-size: 16px; font-weight: 700; color: #1a1a1a;">Total</span>
                                    <span style="font-size: 18px; font-weight: 700; color: #7C3AED;">₹${total}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Invoice Footer -->
                        <div style="background: #f8f7fb; padding: 15px 20px; text-align: center; border-top: 1px solid #e5e5e5;">
                            <p style="margin: 0; font-size: 11px; color: #666;">This is a computer generated invoice and does not require signature.</p>
                            <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">Hookit Technologies • hookit.online • support@hookit.online</p>
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div style="background: #fff3e0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
                        <p style="margin: 0; color: #e65100; font-weight: 600; font-size: 15px;">
                            📱 The seller will contact you for order updates
                        </p>
                        <p style="margin: 8px 0 0 0; color: #666; font-size: 13px;">
                            You can also reach out to <strong>${orderDetails.sellerName}</strong> at ${orderDetails.sellerPhone || 'N/A'}
                        </p>
                    </div>

                    <!-- Contact Seller -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <a href="https://wa.me/${(orderDetails.sellerWhatsapp || orderDetails.sellerPhone || '').replace(/[^0-9]/g, '')}?text=Hi%2C%20I%20placed%20order%20%23${orderDetails.orderId.slice(0, 8)}%20on%20Hookit"
                           style="display: inline-block; padding: 12px 28px; background: #25d366; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                            📱 Contact Seller on WhatsApp
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #999;">
                            Questions? Reply to this email or contact us at support@hookit.online
                        </p>
                        <p style="margin: 8px 0 0 0; font-size: 11px; color: #bbb;">
                            © ${new Date().getFullYear()} Hookit. All rights reserved.
                        </p>
                    </div>
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