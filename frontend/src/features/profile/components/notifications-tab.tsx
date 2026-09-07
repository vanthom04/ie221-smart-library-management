import { Card, CardContent } from "@/components/ui/card"

export const NotificationsTab = () => {
  return (
    <Card className="rounded-lg py-8 shadow-sm">
      <CardContent className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Chưa có thông báo nào để hiển thị.</p>
      </CardContent>
    </Card>
  )
}
