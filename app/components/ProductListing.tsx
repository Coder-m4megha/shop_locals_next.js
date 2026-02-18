"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import ProductListingComponent from '@/app/products/product-listing';

interface ProductListingProps {
  category?: string;
  color?: string;
  fabric?: string;
  occasion?: string;
  priceRange?: string;
  sort?: string;
}

export default function ProductListing({
  category,
  color,
  fabric,
  occasion,
  priceRange,
  sort,
}: ProductListingProps) {
  // Make sure the router hook is actually used if imported
  const router = useRouter();

  return (
    <ProductListingComponent
      category={category}
      color={color}
      fabric={fabric}
      occasion={occasion}
      priceRange={priceRange}
      sort={sort}
    />
  );
}