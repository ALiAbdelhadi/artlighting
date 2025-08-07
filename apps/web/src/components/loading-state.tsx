import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingState = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <div>
                    <h2 className="text-xl font-semibold">Loading your order...</h2>
                    <p className="text-muted-foreground">This won&lsquo;t take long</p>
                </div>
            </div>
        </div>
    )
}

export default LoadingState