import { notFound } from 'next/navigation'
import { TuneBoard } from './TuneBoard'

export const metadata = { title: 'Tune the handwriting', robots: { index: false } }

export default function TunePage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <TuneBoard />
}
