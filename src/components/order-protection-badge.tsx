// src/components/order-protection-badge.tsx
import { Shield, CheckCircle, Lock } from 'lucide-react'

interface OrderProtectionBadgeProps {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'light' | 'dark' | 'green'
}

export default function OrderProtectionBadge({ size = 'md', variant = 'green' }: OrderProtectionBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-1 gap-1',
        md: 'text-sm px-3 py-1.5 gap-1.5',
        lg: 'text-base px-4 py-2 gap-2',
    }

    const variantClasses = {
        light: 'bg-white/90 text-neutral-800 border border-neutral-200',
        dark: 'bg-neutral-900/90 text-white border border-neutral-700',
        green: 'bg-green-50 text-green-700 border border-green-200',
    }

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    }

    return (
        <div className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]}`}>
            <Shield className={`${iconSizes[size]} shrink-0`} />
            <span>Order Protection</span>
            <CheckCircle className={`${iconSizes[size]} shrink-0 opacity-60`} />
        </div>
    )
}