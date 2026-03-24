// components/ui/Tabs.tsx
'use client'

import {cn} from '@/lib/cn'
import React from 'react'

export type TabItem = {
    value: string
    label: string
    color?: string // optional: for dots
    disabled?: boolean // NEW: allow disabling a tab
}

export interface TabsProps {
    items: TabItem[]
    active: string
    onChange: (val: string) => void
    /** Whether to prepend an "All" tab */
    showAll?: boolean
    /** Custom label for the "All" tab (default = "All") */
    allLabel?: string
    className?: string
}

export function Tabs({
                         items,
                         active,
                         onChange,
                         showAll = true,
                         allLabel = 'All',
                         className,
                     }: TabsProps) {
    const filteredItems = React.useMemo(
        () => items.filter((item) => item.value.toLowerCase() !== 'all'),
        [items]
    )

    return (
        <div
            className={cn(
                'flex gap-4 sm:gap-6 mb-10 overflow-x-auto no-scrollbar',
                className
            )}
            role="tablist"
        >
            {/* Built-in All Tab */}
            {showAll && (
                <button
                    type="button"
                    role="tab"
                    aria-selected={active === 'all'}
                    onClick={() => onChange('all')}
                    className={cn(
                        'px-4 sm:px-6 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors',
                        active === 'all'
                            ? 'border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))]'
                            : 'border-transparent text-muted-fg hover:text-fg'
                    )}
                >
                    {allLabel}
                </button>
            )}

            {/* Other Tabs */}
            {filteredItems.map((item) => {
                const isActive = active === item.value
                const isDisabled = item.disabled

                return (
                    <button
                        key={item.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-disabled={isDisabled || undefined}
                        disabled={isDisabled}
                        onClick={() => !isDisabled && onChange(item.value)}
                        className={cn(
                            'px-4 sm:px-6 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center',
                            isActive
                                ? 'border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))]'
                                : isDisabled
                                    ? 'border-transparent text-muted-fg opacity-50 cursor-not-allowed'
                                    : 'border-transparent text-muted-fg hover:text-fg'
                        )}
                    >
                        {item.color && (
                            <span
                                className="inline-block w-2 h-2 rounded-full mr-2"
                                style={{backgroundColor: item.color}}
                                aria-hidden="true"
                            />
                        )}
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}
