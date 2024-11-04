// components/QuickStatCard.js

import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export default function QuickStatCard({ icon, title, value, accentColor }) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full p-3 bg-[${accentColor}] bg-opacity-10 mr-4`}>
          {icon}
        </div>
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle>{value}</CardTitle>
        </div>
      </CardContent>
    </Card>
  )
}
