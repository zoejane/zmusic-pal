import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CardWrapperProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function CardWrapper({ title, children, className }: CardWrapperProps) {
  return (
    <Card className={`bg-card text-card-foreground shadow-sm ${className}`}>
      <CardHeader className="bg-muted p-2 sm:p-3">
        <CardTitle className="text-primary text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">{children}</CardContent>
    </Card>
  )
}

