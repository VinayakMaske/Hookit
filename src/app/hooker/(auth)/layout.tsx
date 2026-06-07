// src/app/hooker/(auth)/layout.tsx
export default function HookerAuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8f7fb] flex items-center justify-center p-4">
            {children}
        </div>
    )
}
