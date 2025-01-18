import KeyFinder from '@/components/KeyFinder'
import ChordFinder from '@/components/ChordFinder'
import AIPal from '@/components/AIPal'

export default function Home() {
  return (
    <div className="container mx-auto py-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <KeyFinder />
          <ChordFinder />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <AIPal />
          </div>
        </div>
      </div>
    </div>
  )
}

