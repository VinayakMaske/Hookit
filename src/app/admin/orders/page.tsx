// src/app/seller/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, MapPin, ShoppingCart, Calendar, MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react'

interface Order {
    id: string
    status: string
    payment_status: string
    total_amount: number
    quantity: number
    buyer_name: string
    buyer_phone: string
    buyer_email: string
    buyer_address: string
    created_at: string
    products: {
        name: string
        images: string[]
    } | null
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [sendingEmail, setSendingEmail] = useState<Record<string, boolean>>({})
    const [emailSent, setEmailSent] = useState<Record<string, boolean>>({})
    const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({})
    const [updating, setUpdating] = useState<Record<string, boolean>>({})

    const fetchOrders = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setLoading(false)
            return
        }

        const { data: store } = await supabase
            .from('stores')
            .select('id, whatsapp_number, name')
            .eq('owner_id', user.id)
            .single()

        if (!store) {
            setLoading(false)
            return
        }

        const { data: ordersData } = await supabase
            .from('orders')
            .select('*, products(name, images)')
            .eq('store_id', store.id)
            .order('created_at', { ascending: false })

        if (ordersData) {
            setOrders(ordersData as Order[])
            const statuses: Record<string, string> = {}
            ordersData.forEach((order: any) => {
                statuses[order.id] = order.status
            })
            setSelectedStatuses(statuses)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [orderId]: newStatus
        }))
    }

    const updateStatus = async (orderId: string) => {
        const newStatus = selectedStatuses[orderId]
        const currentOrder = orders.find(o => o.id === orderId)
        
        if (!newStatus || !currentOrder || newStatus === currentOrder.status) {
            return
        }

        setUpdating(prev => ({ ...prev, [orderId]: true }))

        try {
            const response = await fetch('/api/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            })

            const data = await response.json()

            if (response.ok) {
                await fetchOrders()
            } else {
                alert(data.error || 'Failed to update status')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to update status')
        } finally {
            setUpdating(prev => ({ ...prev, [orderId]: false }))
        }
    }

    const sendStatusEmail = async (orderId: string) => {
        const status = selectedStatuses[orderId]
        if (!status) return

        setSendingEmail(prev => ({ ...prev, [orderId]: true }))
        setEmailSent(prev => ({ ...prev, [orderId]: false }))

        try {
            const response = await fetch('/api/orders/send-status-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            })

            const data = await response.json()

            if (response.ok) {
                setEmailSent(prev => ({ ...prev, [orderId]: true }))
                setTimeout(() => {
                    setEmailSent(prev => ({ ...prev, [orderId]: false }))
                }, 3000)
            } else {
                alert(data.error || 'Failed to send email')
            }
        } catch (error) {
            alert('Failed to send status email')
        } finally {
            setSendingEmail(prev => ({ ...prev, [orderId]: false }))
        }
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        completed: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
                <p className="text-neutral-500 mt-1">Manage and track all your orders</p>
            </div>

            {orders && orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const hasStatusChanged = selectedStatuses[order.id] !== order.status
                        
                        return (
                            <Card key={order.id} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                            {order.products?.images?.[0] ? (
                                                <img
                                                    src={order.products.images[0]}
                                                    alt={order.products.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-neutral-900">
                                                        {order.products?.name || 'Unknown Product'}
                                                    </h3>
                                                    <p className="text-sm text-neutral-500">
                                                        Order #{order.id.slice(0, 8)} • {' '}
                                                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[order.status] || 'bg-neutral-100')}>
                                                            {order.status}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-neutral-900">₹{order.total_amount}</p>
                                                    <p className="text-sm text-neutral-500">Qty: {order.quantity}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-neutral-500 uppercase">Buyer Details</p>
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-neutral-900">{order.buyer_name}</p>
                                                        {order.buyer_phone && (
                                                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {order.buyer_phone}
                                                            </p>
                                                        )}
                                                        {order.buyer_email && (
                                                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {order.buyer_email}
                                                            </p>
                                                        )}
                                                        {order.buyer_address && (
                                                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" /> {order.buyer_address}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-neutral-500 uppercase">Order Info</p>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-neutral-600 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                        <p className="text-sm text-neutral-600">
                                                            Payment: <span className={cn('font-medium', order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600')}>{order.payment_status}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                                <Select 
                                                    value={selectedStatuses[order.id] || order.status} 
                                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button 
                                                    size="sm" 
                                                    onClick={() => updateStatus(order.id)}
                                                    disabled={!hasStatusChanged || updating[order.id]}
                                                >
                                                    {updating[order.id] ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Update'
                                                    )}
                                                </Button>

                                                {order.buyer_email && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                                                        onClick={() => sendStatusEmail(order.id)}
                                                        disabled={sendingEmail[order.id] || emailSent[order.id]}
                                                    >
                                                        {sendingEmail[order.id] ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Sending...
                                                            </>
                                                        ) : emailSent[order.id] ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                                Sent!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="w-4 h-4" />
                                                                Send Status Email
                                                            </>
                                                        )}
                                                    </Button>
                                                )}

                                                {order.buyer_phone && (
                                                    <>
                                                        <a
                                                            href={`https://wa.me/${order.buyer_phone.replace(/[^0-9]/g, '')}?text=Hi ${order.buyer_name}, this is regarding your order #${order.id.slice(0, 8)} from our store.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button variant="outline" size="sm" className="gap-2">
                                                                <Phone className="w-4 h-4" />
                                                                WhatsApp Buyer
                                                            </Button>
                                                        </a>

                                                        <a
                                                            href={`https://wa.me/${order.buyer_phone.replace(/[^0-9]/g, '')}?text=Hi ${order.buyer_name}, your order #${order.id.slice(0, 8)} has been confirmed! We'll update you on delivery.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button variant="outline" size="sm" className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
                                                                <MessageCircle className="w-4 h-4" />
                                                                Message Buyer
                                                            </Button>
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShoppingCart className="w-12 h-12 text-neutral-300 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders yet</h3>
                        <p className="text-neutral-500">Orders will appear here when buyers purchase your products</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(' ')
}