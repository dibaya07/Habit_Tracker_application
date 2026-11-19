import React from 'react';
import BrandMark from '@/components/ui/BrandMark';
import BrandLogoClient from './BrandLogoClient';

export default function BrandLogo() {
  return <BrandLogoClient logoMark={<BrandMark size={34} />} />;
}
