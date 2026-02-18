#!/usr/bin/env tsx

import { seedProducts } from './seed-data'

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    const result = await seedProducts()
    
    if (result.success) {
      console.log('✅ Database seeding completed successfully!')
      console.log(result.message)
    } else {
      console.error('❌ Database seeding failed!')
      console.error(result.message)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Database seeding failed with error:', error)
    process.exit(1)
  }
}

main()
  .catch((error) => {
    console.error('❌ Unexpected error during seeding:', error)
    process.exit(1)
  })
