"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, RefreshCw, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

interface VirtualTryOnProps {
  productImage: string
  productName: string
}

export default function VirtualTryOn({ productImage, productName }: VirtualTryOnProps) {
  const { toast } = useToast()
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [combinedImage, setCombinedImage] = useState<string | null>(null)
  const [opacity, setOpacity] = useState([0.8])
  const [scale, setScale] = useState([1])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Helper function to create image elements
  const createImageElement = (): HTMLImageElement => {
    const img = document.createElement('img')
    return img
  }

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsCapturing(true)
      setCapturedImage(null)
      setCombinedImage(null)
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use the virtual try-on feature.",
        variant: "destructive",
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCapturing(false)
    }
  }

  // Capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        stopCamera()

        // Create combined image
        createCombinedImage(imageDataUrl)
      }
    }
  }

  // Create combined image (overlay product on selfie)
  const createCombinedImage = (selfieImage: string) => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (context) {
      const selfie = createImageElement()
      const product = createImageElement()

      selfie.crossOrigin = "anonymous"
      product.crossOrigin = "anonymous"

      selfie.onload = () => {
        canvas.width = selfie.width
        canvas.height = selfie.height

        // Draw selfie
        context.drawImage(selfie, 0, 0)

        // Draw product with current opacity, scale and position
        product.onload = () => {
          const productWidth = product.width * scale[0]
          const productHeight = product.height * scale[0]
          const centerX = (canvas.width - productWidth) / 2 + position.x
          const centerY = (canvas.height - productHeight) / 2 + position.y

          context.globalAlpha = opacity[0]
          context.drawImage(product, centerX, centerY, productWidth, productHeight)

          const combinedImageUrl = canvas.toDataURL("image/png")
          setCombinedImage(combinedImageUrl)
        }

        product.src = productImage
      }

      selfie.src = selfieImage
    }
  }

  // Update combined image when adjustments change
  useEffect(() => {
    if (capturedImage) {
      createCombinedImage(capturedImage)
    }
  }, [opacity, scale, position, capturedImage, productImage])

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Download combined image
  const downloadImage = () => {
    if (combinedImage) {
      const link = document.createElement("a")
      link.href = combinedImage
      link.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-try-on.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Image downloaded",
        description: "Your virtual try-on image has been downloaded.",
      })
    }
  }

  // Share combined image
  const shareImage = async () => {
    if (combinedImage && navigator.share) {
      try {
        const blob = await fetch(combinedImage).then((r) => r.blob())
        const file = new File([blob], `${productName}-try-on.png`, { type: "image/png" })

        await navigator.share({
          title: `Virtual Try-On: ${productName}`,
          text: "Check out how this looks on me!",
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
        toast({
          title: "Sharing failed",
          description: "Unable to share the image. Try downloading it instead.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support sharing. Try downloading the image instead.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-serif mb-4">Virtual Try-On</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div
            className="relative aspect-square border rounded-lg overflow-hidden bg-muted"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isCapturing ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : capturedImage ? (
              <Image src={combinedImage || capturedImage} alt="Captured" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Take a selfie to see how this product looks on you</p>
                <Button onClick={startCamera}>Start Camera</Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center mt-4">
            {isCapturing ? (
              <Button onClick={captureImage}>Capture Photo</Button>
            ) : capturedImage ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={startCamera}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button variant="outline" onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={shareImage}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          {capturedImage && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Transparency</h4>
                <Slider value={opacity} min={0.1} max={1} step={0.05} onValueChange={setOpacity} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Size</h4>
                <Slider value={scale} min={0.5} max={1.5} step={0.05} onValueChange={setScale} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Position</h4>
                <p className="text-sm text-muted-foreground mb-4">Click and drag the image to adjust position</p>
                <Button variant="outline" size="sm" onClick={() => setPosition({ x: 0, y: 0 })}>
                  Reset Position
                </Button>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Adjust transparency to blend the product with your image</li>
                  <li>• Use the size slider to match your proportions</li>
                  <li>• Drag the product to position it correctly</li>
                  <li>• Take the photo in good lighting for best results</li>
                </ul>
              </div>
            </div>
          )}

          {!capturedImage && (
            <div>
              <h4 className="text-lg font-medium mb-4">How It Works</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Take a Selfie</p>
                    <p className="text-sm text-muted-foreground">Click "Start Camera" and take a photo of yourself</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Adjust the Product</p>
                    <p className="text-sm text-muted-foreground">Use the sliders to adjust transparency and size</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Position the Product</p>
                    <p className="text-sm text-muted-foreground">Drag the product to position it correctly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="text-primary font-medium">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Save or Share</p>
                    <p className="text-sm text-muted-foreground">
                      Download your virtual try-on image or share it with friends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}