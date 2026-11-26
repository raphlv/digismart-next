'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewsGeneratorPage from '../news-generator/page';

export default function PressReleasePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/news-generator/?mode=press-release');
  }, [router]);

  return <NewsGeneratorPage />;
}
