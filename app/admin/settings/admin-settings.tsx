'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings, Save, RefreshCw, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsData {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  currency: string
  taxRate: number
  shippingFee: number
  freeShippingThreshold: number
  enableReviews: boolean
  enableWishlist: boolean
  enableNotifications: boolean
  maintenanceMode: boolean
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: 'Mohit Sarees',
    siteDescription: 'Premium collection of traditional and designer sarees',
    contactEmail: 'support@mohitsarees.com',
    contactPhone: '+91 9936981786',
    address: 'Mumbai, Maharashtra, India',
    currency: 'INR',
    taxRate: 18,
    shippingFee: 100,
    freeShippingThreshold: 2000,
    enableReviews: true,
    enableWishlist: true,
    enableNotifications: true,
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Use default settings if fetch fails
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Settings saved successfully')
      } else {
        toast.error(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage application settings and configurations</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic site information and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              placeholder="Enter site name"
            />
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              placeholder="Enter site description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Customer support and business contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="support@example.com"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+91 9936981786"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter business address"
                className="pl-10"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E-commerce Settings */}
      <Card>
        <CardHeader>
          <CardTitle>E-commerce Settings</CardTitle>
          <CardDescription>Pricing, shipping, and transaction settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                placeholder="INR"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                placeholder="18"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shippingFee">Shipping Fee (₹)</Label>
              <Input
                id="shippingFee"
                type="number"
                value={settings.shippingFee}
                onChange={(e) => handleInputChange('shippingFee', parseFloat(e.target.value) || 0)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                placeholder="2000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Settings</CardTitle>
          <CardDescription>Enable or disable application features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableReviews">Product Reviews</Label>
              <p className="text-sm text-muted-foreground">Allow customers to review products</p>
            </div>
            <Switch
              id="enableReviews"
              checked={settings.enableReviews}
              onCheckedChange={(checked) => handleInputChange('enableReviews', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableWishlist">Wishlist</Label>
              <p className="text-sm text-muted-foreground">Allow customers to save favorite products</p>
            </div>
            <Switch
              id="enableWishlist"
              checked={settings.enableWishlist}
              onCheckedChange={(checked) => handleInputChange('enableWishlist', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send order and promotional emails</p>
            </div>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
