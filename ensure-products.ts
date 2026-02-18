import { prisma } from './lib/prisma'

async function ensureProducts() {
  try {
    console.log('Ensuring products exist in database...')

    // Check if products exist
    const existingProducts = await prisma.product.findMany()
    console.log(`Found ${existingProducts.length} existing products`)

    // If no products exist, create them
    if (existingProducts.length === 0) {
      console.log('Creating sample products...')

      const products = [
        {
          id: "1",
          name: "Banarasi Silk Saree",
          description: "Exquisite Banarasi silk saree with intricate gold zari work",
          price: 24999,
          salePrice: null,
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
          description: "Stunning gold brocade designer blouse with intricate patterns",
          price: 12999,
          salePrice: null,
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
          description: "Royal blue georgette blouse with exquisite embroidery and sequin work",
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
          id: "7",
          name: "Kanjeevaram Silk Saree",
          description: "Exquisite Kanjeevaram silk saree with traditional South Indian craftsmanship",
          price: 34999,
          salePrice: 29999,
          imageUrls: JSON.stringify([
            "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_3_1024x1024.jpg?v=1698125767",
            "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_6_1024x1024.jpg?v=1698125765",
            "https://clothsvilla.com/cdn/shop/products/B-Vipul-Shallvi-Silk-Purple_1.jpg",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'kanjeevaram', 'silk', 'wedding', 'traditional']),
          stock: 8,
          sku: "SAREE-KAN-001",
          isActive: true,
        },
        {
          id: "8",
          name: "Embellished Bridal Saree",
          description: "Stunning embellished bridal saree with heavy embroidery work",
          price: 45999,
          salePrice: 39999,
          imageUrls: JSON.stringify([
            "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_01_1.jpg?width=820",
            "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_03_1.jpg?width=820",
            "https://www.soch.com/media/catalog/product/s/r/srcaplc100799b_04_1.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'bridal', 'embellished', 'wedding']),
          stock: 5,
          sku: "SAREE-EMB-001",
          isActive: true,
        },
        {
          id: "9",
          name: "Designer Wedding Saree",
          description: "Designer wedding saree with exquisite craftsmanship",
          price: 38999,
          salePrice: 32999,
          imageUrls: JSON.stringify([
            "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_02.jpg?width=820",
            "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_04.jpg?width=1200",
            "https://www.soch.com/media/catalog/product/w/i/wine_floral_print_crepe_saree_womens_soch-srevfs112036a_03.jpg?width=750&height=1125&canvas=750,1125&optimize=medium&bg-color=255,255,255&fit=bounds",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'designer', 'wedding', 'luxury']),
          stock: 8,
          sku: "SAREE-DES-001",
          isActive: true,
        },
        {
          id: "10",
          name: "Red Bridal Silk Saree",
          description: "Magnificent red bridal silk saree with gold zari work",
          price: 42999,
          salePrice: 36999,
          imageUrls: JSON.stringify([
            "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2024/DECEMBER/4/NBCn41cG_7e28348561d442f6b04a99b02a3f4d24.jpg",
            "https://queensuits.com/wp-content/uploads/2024/06/Beautiful-Red-Color-Soft-Lichi-Silk-Jacquard-All-Over-Work-Saree-2-1.jpeg",
            "https://assets0.mirraw.com/images/12562525/image_zoom.jpeg?1718496094",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'bridal', 'red', 'silk']),
          stock: 6,
          sku: "SAREE-RED-001",
          isActive: true,
        },
        {
          id: "11",
          name: "Gold Zari Work Bridal Saree",
          description: "Opulent bridal saree with extensive gold zari work",
          price: 48999,
          salePrice: 41999,
          imageUrls: JSON.stringify([
            "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_04.jpg?width=1200",
            "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_02.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
            "https://www.soch.com/media/catalog/product/g/o/gold_tissue_saree_with_sequins_work_womens_soch-srocebl111211a_01.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'bridal', 'gold', 'zari']),
          stock: 4,
          sku: "SAREE-GOLD-001",
          isActive: true,
        },
        {
          id: "12",
          name: "Designer Blouse",
          description: "Elegant red georgette designer blouse with embroidery work",
          price: 14999,
          salePrice: 11999,
          imageUrls: JSON.stringify([
            "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_01.jpg?width=820",
            "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_02.jpg?width=820",
            "https://www.soch.com/media/catalog/product/r/e/red_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667a_03.jpg?width=820",
          ]),
          category: "blouses",
          tags: JSON.stringify(['blouse', 'designer', 'red', 'georgette']),
          stock: 15,
          sku: "BLOUSE-RED-001",
          isActive: true,
        },
        {
          id: "13",
          name: "Chanderi Cotton Saree",
          description: "Elegant purple Chanderi cotton saree with floral prints and tassels",
          price: 9999,
          salePrice: 7999,
          imageUrls: JSON.stringify([
            "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_04.jpg?width=820",
            "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_01.jpg?width=820",
            "https://www.soch.com/media/catalog/product/p/u/purple_chanderi_floral_print_saree_with_tassels_womens_soch-srevjq114180a_03.jpg?width=820",
          ]),
          category: "sarees",
          tags: JSON.stringify(['saree', 'chanderi', 'cotton', 'purple', 'floral']),
          stock: 12,
          sku: "SAREE-CHA-001",
          isActive: true,
        },
      ]

      for (const product of products) {
        await prisma.product.create({
          data: product,
        })
        console.log(`✅ Created product: ${product.name}`)
      }
    } else {
      console.log('Products already exist, updating image URLs...')

      // Update existing products with correct image URLs
      await prisma.product.updateMany({
        where: { name: "Banarasi Silk Saree" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo1.jpg-n8IvY51Jy5pdLZDoCgLJco1ZVXkViO.jpeg",
            "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/v/n/e/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrf592kgvn.jpeg?q=20&crop=false",
            "https://rukminim2.flixcart.com/image/850/1000/kqmo8sw0/sari/f/x/d/free-your-dream-wedding-look-should-seamlessly-fit-your-comfort-original-imag4hhrsyhavxeu.jpeg?q=20&crop=false",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Gold Brocade Designer Blouse" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black_tussar_woven_design_blouse_womens_soch-blsljqd00652c_01-w3rd2yNomrTo2LNcYEqUpeupvMnQfz.webp",
            "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750170_437Wx649H_202503201352162.jpeg",
            "https://img.tatacliq.com/images/i23//437Wx649H/MP000000025750164_437Wx649H_202503201352114.jpeg",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Royal Blue Embroidered Blouse" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_01-NPQpXwvaebwWLqaRYDtX0TUXJ230a6.webp",
            "https://www.soch.com/media/catalog/product/i/n/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_02.jpg?width=440&height=660",
            "https://www.soch.com/media/catalog/product/i/n/indigo_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667i_03.jpg?width=440&height=660",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Teal Embroidered Blouse" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_01-mwsaxIUrxuAcQMhQa3JEVn4BipvB6o.webp",
            "https://www.soch.com/media/catalog/product/t/e/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_03.jpg?width=440&height=660",
            "https://www.soch.com/media/catalog/product/t/e/teal_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667d_02.jpg?width=440&height=660",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Cream Floral Embroidered Blouse" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_01-jvqcLo9vcEAdWZvLuJ219AtQPyB7FX.webp",
            "https://www.soch.com/media/catalog/product/c/r/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_02.jpg?width=440&height=660",
            "https://www.soch.com/media/catalog/product/c/r/cream_georgette_embroidered_blouse_with_sequins_womens_soch-blhsksh00667c_03.jpg?width=440&height=660",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Peach Organza Blouse" },
        data: {
          imageUrls: JSON.stringify([
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_01-B16q3yAZcKUp2HWUx4i4Q1QHTHiSqs.webp",
            "https://www.soch.com/media/catalog/product/p/e/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_02.jpg?width=1200",
            "https://www.soch.com/media/catalog/product/p/e/peach_organza_embellished_blouse_with_sequins_womens_soch-blhsemb00656c_03.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=",
          ])
        }
      })

      await prisma.product.updateMany({
        where: { name: "Kanjeevaram Silk Saree" },
        data: {
          imageUrls: JSON.stringify([
            "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT0oU4Jgh3TNFjyyyaVOyOGPBj4uC1Im8q7RWT2du8c_VHlgiRGaJHgiBx9wIxdud_YVjfgndgKCNAjL5pcxKzvGY88snWDChv7yA6JF1IMo68rMsjvZCRv5Q",
            "https://www.soosi.co.in/cdn/shop/products/IMG-20190506-WA0069_1200x1200.jpg?v=1571711124",
            "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRTGzM66kVOE6fMAj2YN4S0CCeS393rbGltKMVBfE3VUSEB1kBsGKQvP6EghOdnv6gFjOP9oGjba75LMQGJMEpLOlQTN11cqJXOJNkk4m-aq0xXtrLM3r6j",
          ])
        }
      })

      console.log('✅ Updated product image URLs')
    }

    // List all products
    const allProducts = await prisma.product.findMany()
    console.log('\n📋 Current products in database:')
    allProducts.forEach(product => {
      console.log(`- ID: ${product.id}, Name: ${product.name}`)
    })

    console.log('\n🎉 Database setup complete!')

  } catch (error) {
    console.error('❌ Error ensuring products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

ensureProducts()
