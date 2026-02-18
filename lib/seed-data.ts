import { prisma } from "@/lib/prisma"

export const seedProducts = async () => {
  try {
    console.log('Starting database seeding with proper image paths...')

    // Create sample products with real image paths
    const products = [
      {
        id: "1",
        name: "Banarasi Silk Saree",
        description: "This exquisite Banarasi silk saree is handcrafted by skilled artisans using traditional techniques. The rich red color symbolizes prosperity and is adorned with intricate gold zari work that showcases the heritage of Indian craftsmanship. Perfect for weddings and special occasions, this saree is a timeless addition to your ethnic wardrobe.",
        price: 24999,
        salePrice: 19999,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
          "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/v/n/e/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrf592kgvn.jpeg?q=20&crop=false",
          "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/f/x/d/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrsyhavxeu.jpeg?q=20&crop=false",
        ]),
        category: "sarees",
        tags: JSON.stringify(['silk', 'wedding', 'banarasi', 'zari']),
        stock: 15,
        sku: "SAREE-BAN-001",
        isActive: true,
      },
      {
        id: "2",
        name: "Gold Brocade Designer Blouse",
        description: "This stunning gold brocade designer blouse features intricate woven patterns that add a touch of luxury to your ensemble. The metallic gold finish catches the light beautifully, making it perfect for special occasions and celebrations. Pair it with a contrasting saree for a head-turning look.",
        price: 12999,
        salePrice: 9999,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
          "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750170_437Wx649H_202503201352162.jpeg",
          "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750164_437Wx649H_202503201352114.jpeg",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'brocade', 'gold', 'designer']),
        stock: 12,
        sku: "BLOUSE-BRO-001",
        isActive: true,
      },
      {
        id: "3",
        name: "Royal Blue Embroidered Blouse",
        description: "This royal blue georgette blouse features exquisite embroidery and sequin work that adds a touch of glamour to your festive ensemble. The vibrant blue color is complemented by intricate patterns, making it a versatile piece that can be paired with various sarees for different occasions.",
        price: 15999,
        salePrice: 12999,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
          "https://www.soch.com/media/catalog/product/i/n/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_02.jpg?width=440&height=660",
          "https://www.soch.com/media/catalog/product/i/n/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_03.jpg?width=440&height=660",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'embroidery', 'blue', 'georgette']),
        stock: 20,
        sku: "BLOUSE-EMB-001",
        isActive: true,
      },
      {
        id: "4",
        name: "Teal Embroidered Blouse",
        description: "This teal georgette blouse features delicate floral embroidery and sequin details that catch the light beautifully. The rich teal color provides a sophisticated backdrop for the intricate needlework, making it perfect for festive occasions and celebrations.",
        price: 15999,
        salePrice: null,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
          "https://www.soch.com/media/catalog/product/t/e/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_03.jpg?width=440&height=660",
          "https://www.soch.com/media/catalog/product/t/e/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_02.jpg?width=440&height=660",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'embroidery', 'teal', 'georgette']),
        stock: 18,
        sku: "BLOUSE-EMB-002",
        isActive: true,
      },
      {
        id: "5",
        name: "Peach Organza Blouse",
        description: "This peach organza blouse features delicate floral embroidery and metallic accents that add a touch of elegance to your bridal ensemble. The soft peach color is complemented by intricate patterns, making it a perfect choice for wedding ceremonies and special occasions.",
        price: 18999,
        salePrice: 15999,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
          "https://www.soch.com/media/catalog/product/p/e/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_02.jpg?width=1200",
          "https://www.soch.com/media/catalog/product/p/e/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_03.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'embroidery', 'peach', 'organza']),
        stock: 10,
        sku: "BLOUSE-ORG-001",
        isActive: true,
      },
      {
        id: "6",
        name: "Cream Floral Embroidered Blouse",
        description: "This cream georgette blouse features intricate floral embroidery that adds a touch of elegance to your festive ensemble. The neutral cream color makes it versatile enough to pair with sarees of various colors and patterns, making it a valuable addition to your ethnic wardrobe.",
        price: 16999,
        salePrice: 13999,
        imageUrls: JSON.stringify([
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
          "https://www.soch.com/media/catalog/product/c/r/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_02.jpg?width=440&height=660",
          "https://www.soch.com/media/catalog/product/c/r/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_03.jpg?width=440&height=660",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'embroidery', 'cream', 'floral']),
        stock: 15,
        sku: "BLOUSE-EMB-003",
        isActive: true,
      },
      {
        id: "7",
        name: "Kanjeevaram Silk Saree",
        description: "This exquisite Kanjeevaram silk saree features traditional South Indian craftsmanship with rich red color and intricate gold zari work. The heavy silk fabric and authentic weaving techniques make it perfect for weddings and special ceremonies. A timeless piece that represents the heritage of Tamil Nadu's textile artistry.",
        price: 34999,
        salePrice: 29999,
        imageUrls: JSON.stringify([
          "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_3_1024x1024.jpg?v=1698125767",
          "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_6_1024x1024.jpg?v=1698125765",
          "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_1.jpg",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'kanjeevaram', 'silk', 'wedding', 'traditional', 'red', 'zari']),
        stock: 8,
        sku: "SAREE-KAN-001",
        isActive: true,
      },
      {
        id: "8",
        name: "Embellished Bridal Saree",
        description: "This stunning embellished bridal saree features heavy embroidery work with sequins, beads, and zari detailing. Perfect for wedding ceremonies, this saree combines traditional craftsmanship with contemporary design elements to create a truly magnificent bridal ensemble.",
        price: 45999,
        salePrice: 39999,
        imageUrls: JSON.stringify([
          "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_01_1.jpg?width=820",
          "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_03_1.jpg?width=820",
          "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_04_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'bridal', 'embellished', 'wedding', 'heavy work']),
        stock: 5,
        sku: "SAREE-EMB-001",
        isActive: true,
      },
      {
        id: "9",
        name: "Designer Wedding Saree",
        description: "This designer wedding saree showcases exquisite craftsmanship with intricate patterns and luxurious fabric. Designed for the modern bride who appreciates traditional elegance with contemporary flair, this saree is perfect for wedding ceremonies and special occasions.",
        price: 38999,
        salePrice: 32999,
        imageUrls: JSON.stringify([
          "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_02.jpg?width=820",
          "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_04.jpg?width=1200",
          "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_03.jpg?width=750&height=1125&canvas=750,1125&optimize=medium&bg-color=255,255,255&fit=bounds",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'designer', 'wedding', 'luxury', 'bridal']),
        stock: 8,
        sku: "SAREE-DES-001",
        isActive: true,
      },
      {
        id: "10",
        name: "Red Bridal Silk Saree",
        description: "This magnificent red bridal silk saree embodies the essence of traditional Indian weddings. Crafted from pure silk with intricate gold zari work, this saree represents prosperity and joy. The rich red color symbolizes love and commitment, making it perfect for the bride's special day.",
        price: 42999,
        salePrice: 36999,
        imageUrls: JSON.stringify([
          "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2024/DECEMBER/4/NBCn41cG_7e28348561d442f6b04a99b02a3f4d24.jpg",
          "https://queensuits.com/wp-content/uploads/2024/06/Beautiful-Red-Color-Soft-Lichi-Silk-Jacquard-All-Over-Work-Saree-2-1.jpeg",
          "https://assets0.mirraw.com/images/12562525/image_zoom.jpeg?1718496094",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'bridal', 'red', 'silk', 'traditional']),
        stock: 6,
        sku: "SAREE-RED-001",
        isActive: true,
      },
      {
        id: "11",
        name: "Gold Zari Work Bridal Saree",
        description: "This opulent bridal saree features extensive gold zari work that creates stunning patterns across the fabric. The intricate metallic threadwork catches light beautifully, creating a regal appearance perfect for wedding ceremonies and grand celebrations.",
        price: 48999,
        salePrice: 41999,
        imageUrls: JSON.stringify([
          "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_04.jpg?width=1200",
          "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_02.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
          "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_01.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'bridal', 'gold', 'zari', 'heavy work']),
        stock: 4,
        sku: "SAREE-GOLD-001",
        isActive: true,
      },
      {
        id: "12",
        name: "Designer Blouse",
        description: "This elegant red georgette designer blouse features exquisite embroidery work with sequins that adds glamour to your festive ensemble. The rich red color and intricate patterns make it a versatile piece perfect for special occasions and celebrations.",
        price: 14999,
        salePrice: 11999,
        imageUrls: JSON.stringify([
          "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_01.jpg?width=820",
          "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_02.jpg?width=820",
          "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_03.jpg?width=820",
        ]),
        category: "blouses",
        tags: JSON.stringify(['blouse', 'designer', 'red', 'georgette', 'embroidery']),
        stock: 15,
        sku: "BLOUSE-RED-001",
        isActive: true,
      },
      {
        id: "13",
        name: "Chanderi Cotton Saree",
        description: "This elegant purple Chanderi cotton saree features beautiful floral prints and decorative tassels that add a touch of traditional charm. The lightweight Chanderi fabric offers comfort and grace, making it perfect for festive occasions and celebrations.",
        price: 9999,
        salePrice: 7999,
        imageUrls: JSON.stringify([
          "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_04.jpg?width=820",
          "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_01.jpg?width=820",
          "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_03.jpg?width=820",
        ]),
        category: "sarees",
        tags: JSON.stringify(['saree', 'chanderi', 'cotton', 'purple', 'floral', 'festive']),
        stock: 12,
        sku: "SAREE-CHA-001",
        isActive: true,
      },
    ]

    console.log('Deleting existing products...')

    // Delete existing products first to ensure clean data
    try {
      await prisma.product.deleteMany({
        where: {
          OR: [
            { id: { in: products.map(p => p.id) } },
            { sku: { in: products.map(p => p.sku) } }
          ]
        }
      })
      console.log('Deleted existing products')
    } catch (error) {
      console.error('Error deleting products:', error)
    }

    // Create products one by one
    for (const product of products) {
      try {
        // Check if product with this ID already exists
        const existingProduct = await prisma.product.findUnique({
          where: { id: product.id },
        })

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: product.id },
            data: product,
          })
          console.log(`Updated product: ${product.name}`)
        } else {
          // Create new product
          await prisma.product.create({
            data: product,
          })
          console.log(`Created product: ${product.name}`)
        }
      } catch (error) {
        console.error(`Error creating/updating product ${product.name}:`, error)
      }
    }

    console.log('Seeding completed successfully!')
    return { success: true, message: 'Products seeded successfully' }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, message: 'Failed to seed products' }
  }
}
