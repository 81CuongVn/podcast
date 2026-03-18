'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionManager } from '@/components/subscription-manager'
import { Info } from 'lucide-react'

export default function SubscriptionsManagementPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your podcast subscriptions and subscriber information
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
        <CardContent className="flex gap-3 pt-6">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">Monetization Features</p>
            <p>Enable monetization on your podcasts to start accepting subscriptions and generating revenue.</p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Manager */}
      <SubscriptionManager />
    </div>
  )
}
