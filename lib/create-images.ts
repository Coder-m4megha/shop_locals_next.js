import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export const createProductImages = () => {
  try {
    // Create the products directory if it doesn't exist
    const productsDir = join(process.cwd(), 'public', 'products')
    if (!existsSync(productsDir)) {
      mkdirSync(productsDir, { recursive: true })
    }

    // List of image files to create
    const imageFiles = [
      'banarasi-silk-2.jpg',
      'banarasi-silk-3.jpg',
      'gold-brocade-blouse-2.jpg',
      'gold-brocade-blouse-3.jpg',
      'royal-blue-blouse-2.jpg',
      'royal-blue-blouse-3.jpg',
      'teal-blouse-2.jpg',
      'teal-blouse-3.jpg',
      'peach-blouse-2.jpg',
      'peach-blouse-3.jpg',
      'cream-blouse-2.jpg',
      'cream-blouse-3.jpg',
    ]

    // Create a simple SVG placeholder for each image
    const createSVGPlaceholder = (filename: string, width = 800, height = 600) => {
      const productName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ')
      
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
    ${productName}
  </text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
    ${width} x ${height}
  </text>
</svg>`
    }

    // Create placeholder images
    const createdFiles: string[] = []
    
    imageFiles.forEach(filename => {
      const svgContent = createSVGPlaceholder(filename)
      const filePath = join(productsDir, filename.replace(/\.(jpg|jpeg|png|webp)$/i, '.svg'))
      
      try {
        writeFileSync(filePath, svgContent)
        createdFiles.push(filename)
        console.log(`Created placeholder: ${filename} -> ${filename.replace(/\.(jpg|jpeg|png|webp)$/i, '.svg')}`)
      } catch (error) {
        console.error(`Error creating ${filename}:`, error)
      }
    })

    console.log('Placeholder images created successfully!')
    console.log(`Images created in: ${productsDir}`)
    
    return {
      success: true,
      message: `Created ${createdFiles.length} placeholder images`,
      files: createdFiles
    }
  } catch (error) {
    console.error('Error creating images:', error)
    return {
      success: false,
      message: 'Failed to create placeholder images'
    }
  }
}
