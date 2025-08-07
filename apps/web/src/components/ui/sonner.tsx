"use client"

import React from "react"
import { CircleAlert, CircleCheck, Info, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/70 backdrop-blur-md group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md rounded-2xl dark:backdrop-blur-lg group-[.toaster]:border-0",
          title: "text-base font-medium tracking-tight",
          description:
            "group-[.toast]:text-muted-foreground text-sm font-normal leading-5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-full px-4 py-1.5 text-xs font-medium transition-colors hover:opacity-90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-full px-4 py-1.5 text-xs font-medium transition-colors hover:opacity-80",
          success: "!bg-green-50/95 dark:!bg-green-950/30",
          error: "!bg-red-50/95 dark:!bg-red-950/40",
          warning: "!bg-amber-50/90 dark:!bg-amber-950/30",
          info: "!bg-blue-50/90 dark:!bg-blue-950/30",
          loading: "group-[.toast]:text-muted-foreground",
        },
        duration: 4000,
      }}
      closeButton
      icons={{
        success: (
          <CircleCheck
            strokeWidth={2.5}
            absoluteStrokeWidth
            className="h-5 w-5 text-green-500"
          />
        ),
        error: (
          <X
            strokeWidth={2.5}
            absoluteStrokeWidth
            className="h-5 w-5 text-red-500"
          />
        ),
        warning: (
          <CircleAlert
            strokeWidth={2.5}
            absoluteStrokeWidth
            className="h-5 w-5 text-amber-500"
          />
        ),
        info: (
          <Info
            strokeWidth={2.5}
            absoluteStrokeWidth
            className="h-5 w-5 text-blue-500"
          />
        ),
      }}
      expand={false}
      position="top-center"
      visibleToasts={3}
      gap={8}
      {...props}
    />
  )
}

export { Toaster }
