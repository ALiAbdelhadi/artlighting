"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
    name?: string;
    email: string;
    imageUrl?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    name,
    email,
    imageUrl,
    className = "",
    size = 'md'
}) => {
    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : email.slice(0, 2).toUpperCase();

    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10'
    };

    return (
        <Avatar className={`${sizeClasses[size]} ${className}`}>
            <AvatarImage
                src={imageUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${email}`}
                alt={name || email}
            />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;