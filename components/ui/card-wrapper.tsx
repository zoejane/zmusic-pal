import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardWrapperProps {
  title: string | ReactNode
  children: ReactNode
  className?: string
}

export function CardWrapper({ title, children, className }: CardWrapperProps) {
  return (
    <Card className={cn("bg-card text-card-foreground shadow-sm", className)}>
      <CardHeader className="bg-muted/50 p-2 text-center">
        <CardTitle className="text-primary text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col items-center">{children}</CardContent>
    </Card>
  )
}

