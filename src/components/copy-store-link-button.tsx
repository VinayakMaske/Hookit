'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export default function CopyStoreLinkButton({ slug }: { slug: string }) {
    const [copied, setCopied] = useState(false)
    const storeUrl = `https://hookit.online/store/${slug}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(storeUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = storeUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`gap-2 shrink-0 transition-all ${
                copied 
                    ? 'bg-green-50 border-green-300 text-green-700' 
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                </>
            )}
        </Button>
    )
}