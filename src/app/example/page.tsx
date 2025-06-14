// app/example/page.tsx

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExamplePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Пример страницы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Введите что-нибудь..." />
          <Button className="w-full">Нажми на меня</Button>
        </CardContent>
      </Card>
    </div>
  )
}
// This is a simple example page that uses the Button and Input components.