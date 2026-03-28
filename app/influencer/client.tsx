'use client'

import '../../src/web/mythbusters/index.css';
import { Providers } from '../providers';
import dynamic from 'next/dynamic'

const MythbustersApp = dynamic(() => import('../../src/web/mythbusters/App'), { ssr: false })

export function InfluencerClient() {
  return (
    <Providers>
      <MythbustersApp />
    </Providers>
  );
}
