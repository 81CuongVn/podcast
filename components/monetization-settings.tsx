'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Lock, Zap } from 'lucide-react'

interface MonetizationSettingsProps {
  isMonetized: boolean
  previewMode: 'free' | 'preview-only' | 'paid-only'
  priceUsd: number
  allowFreePreview: boolean
  previewEpisodeCount: number
  onMonetizedChange: (value: boolean) => void
  onPreviewModeChange: (value: 'free' | 'preview-only' | 'paid-only') => void
  onPriceChange: (value: number) => void
  onAllowFreePreviewChange: (value: boolean) => void
  onPreviewEpisodeCountChange: (value: number) => void
}

export function MonetizationSettings({
  isMonetized,
  previewMode,
  priceUsd,
  allowFreePreview,
  previewEpisodeCount,
  onMonetizedChange,
  onPreviewModeChange,
  onPriceChange,
  onAllowFreePreviewChange,
  onPreviewEpisodeCountChange,
}: MonetizationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Monetization Settings
        </CardTitle>
        <CardDescription>
          Configure premium content and pricing for your podcast
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Monetization */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-1">
            <Label className="text-base font-semibold">Enable Monetization</Label>
            <p className="text-sm text-muted-foreground">
              Allow paid access to your podcast content
            </p>
          </div>
          <Switch
            checked={isMonetized}
            onCheckedChange={onMonetizedChange}
          />
        </div>

        {isMonetized && (
          <>
            {/* Preview Mode Selection */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="font-semibold">Content Access Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Choose how listeners can access your content
                </p>
              </div>
              <Select value={previewMode} onValueChange={onPreviewModeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    Free - All episodes available for free
                  </SelectItem>
                  <SelectItem value="preview-only">
                    Preview Only - Show preview clips, charge for full episodes
                  </SelectItem>
                  <SelectItem value="paid-only">
                    Paid Only - All content requires subscription
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Setting */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="price" className="font-semibold">
                  Monthly Subscription Price (USD)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Price per month for accessing your premium content
                </p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.99"
                  min="0"
                  value={priceUsd}
                  onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                  className="pl-7"
                  placeholder="9.99"
                />
              </div>
              {priceUsd > 0 && (
                <Badge variant="outline" className="w-full justify-center">
                  Monthly revenue potential based on subscribers
                </Badge>
              )}
            </div>

            {/* Allow Free Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Allow Free Preview
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Let non-subscribers listen to the first few episodes
                  </p>
                </div>
                <Switch
                  checked={allowFreePreview}
                  onCheckedChange={onAllowFreePreviewChange}
                />
              </div>

              {allowFreePreview && (
                <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                  <Label htmlFor="preview-count" className="text-sm font-semibold">
                    Free Preview Episodes
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Number of episodes to show as free preview
                  </p>
                  <Input
                    id="preview-count"
                    type="number"
                    min="1"
                    max="20"
                    value={previewEpisodeCount}
                    onChange={(e) =>
                      onPreviewEpisodeCountChange(parseInt(e.target.value) || 1)
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Listeners can preview the most recent {previewEpisodeCount}{' '}
                    episode(s) for free
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <p className="text-sm text-foreground">
                <strong>💡 Tip:</strong> Offer free episodes to build an audience, then convert
                them to subscribers with premium content.
              </p>
            </div>
          </>
        )}

        {!isMonetized && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4">
            <p className="text-sm text-foreground">
              <strong>📢 Note:</strong> Your podcast is currently free for all listeners.
              Enable monetization to set up paid content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
