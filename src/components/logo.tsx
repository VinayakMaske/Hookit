// src/components/logo.tsx
export default function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 130 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Icon — Bold H with hook curl */}
            <g transform="translate(0, 2)">
                {/* Left bar of H */}
                <path
                    d="M3 2 L3 26"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                {/* Crossbar of H */}
                <path
                    d="M3 14 L15 14"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                {/* Right bar that curves into hook */}
                <path
                    d="M15 2 L15 16 C15 22 19 22 21 20"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                {/* Hook dot */}
                <circle cx="23" cy="24" r="2.5" fill="#7C3AED" />
            </g>

            {/* Text — "hookit" in Playfair Display italic style */}
            <text
                x="34"
                y="24"
                fill="#7C3AED"
                fontFamily="var(--font-playfair), Georgia, serif"
                fontSize="28"
                fontWeight="700"
                fontStyle="italic"
                letterSpacing="-0.02em"
            >
                hookit
            </text>
        </svg>
    )
}