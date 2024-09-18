import { cn } from '@/lib/utils';
import React from 'react'

const Container = ({ children, className }: {
    className?: string
    children: React.ReactNode;
}) => {
    return (
        <div className={cn("container px-4 md:px-6 py-0", className)}>{children}</div>
    )
}

export default Container