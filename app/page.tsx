import KeyFinder from '@/components/KeyFinder'
import ChordFinder from '@/components/ChordFinder'
import AIPal from '@/components/AIPal'

export default function Home() {
  return (
    <main className="min-h-screen p-2 sm:p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-full mx-auto space-y-4 lg:flex lg:space-y-0 lg:space-x-4 lg:items-start">
        <div className="lg:w-7/12 xl:w-8/12 space-y-4">
          <KeyFinder />
          <ChordFinder />
        </div>
        <div className="lg:w-5/12 xl:w-4/12 lg:sticky lg:top-4">
          <AIPal />
        </div>
      </div>
    </main>
  )
}

