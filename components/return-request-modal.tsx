'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RotateCcw, Package } from 'lucide-react'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
    imageUrls: string
  }
}

interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
}

interface ReturnRequestModalProps {
  order: Order
  trigger?: React.ReactNode
}

const returnReasons = [
  'Defective/Damaged item',
  'Wrong item received',
  'Size doesn\'t fit',
  'Color different from image',
  'Quality not as expected',
  'Changed mind',
  'Other'
]

export default function ReturnRequestModal({ order, trigger }: ReturnRequestModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [itemReasons, setItemReasons] = useState<Record<string, string>>({})
  const [itemDescriptions, setItemDescriptions] = useState<Record<string, string>>({})
  const [preferredResolution, setPreferredResolution] = useState<'REFUND' | 'EXCHANGE'>('REFUND')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to return')
      return
    }

    // Check if all selected items have reasons
    const missingReasons = selectedItems.filter(itemId => !itemReasons[itemId])
    if (missingReasons.length > 0) {
      toast.error('Please select a reason for all selected items')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          items: selectedItems.map(itemId => ({
            orderItemId: itemId,
            reason: itemReasons[itemId],
            description: itemDescriptions[itemId] || '',
          })),
          preferredResolution,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Return request submitted successfully!')
        setOpen(false)
        // Reset form
        setSelectedItems([])
        setItemReasons({})
        setItemDescriptions({})
        setPreferredResolution('REFUND')
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        toast.error(data.error || 'Failed to submit return request')
      }
    } catch (error) {
      console.error('Error submitting return request:', error)
      toast.error('Failed to submit return request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" className="flex-1">
      <RotateCcw className="h-4 w-4 mr-2" />
      Return Items
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Items - Order #{order.orderNumber}</DialogTitle>
          <DialogDescription>
            Select the items you want to return and provide a reason for each item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Items Selection */}
          <div>
            <Label className="text-base font-medium">Select Items to Return</Label>
            <div className="space-y-3 mt-2">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {selectedItems.includes(item.id) && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <Label htmlFor={`reason-${item.id}`}>Reason for Return</Label>
                            <Select
                              value={itemReasons[item.id] || ''}
                              onValueChange={(value) => 
                                setItemReasons(prev => ({ ...prev, [item.id]: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnReasons.map((reason) => (
                                  <SelectItem key={reason} value={reason}>
                                    {reason}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`description-${item.id}`}>
                              Additional Details (Optional)
                            </Label>
                            <Textarea
                              id={`description-${item.id}`}
                              placeholder="Provide additional details about the issue..."
                              value={itemDescriptions[item.id] || ''}
                              onChange={(e) => 
                                setItemDescriptions(prev => ({ ...prev, [item.id]: e.target.value }))
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Resolution */}
          {selectedItems.length > 0 && (
            <div>
              <Label className="text-base font-medium">Preferred Resolution</Label>
              <Select
                value={preferredResolution}
                onValueChange={(value: 'REFUND' | 'EXCHANGE') => setPreferredResolution(value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REFUND">Refund to original payment method</SelectItem>
                  <SelectItem value="EXCHANGE">Exchange for different size/color</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || selectedItems.length === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
