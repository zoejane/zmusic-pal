import KeyFinder from '@/components/KeyFinder'
import ChordFinder from '@/components/ChordFinder'
import AIPal from '@/components/AIPal'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <KeyFinder />
          <ChordFinder />
        </div>
        <div className="lg:col-span-1">
          <div className="relative lg:sticky lg:top-20">
            <AIPal />
          </div>
        </div>
      </div>
    </div>
  )
}

