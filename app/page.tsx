import { KeyFinder } from "@/components/KeyFinder"
import { ChordFinder } from "@/components/ChordFinder"
import AIPal from "@/components/AIPal"

export default function Home() {
  return (
    <div className="container mx-auto px-2 py-1 sm:px-4 lg:px-6 max-w-5xl overflow-x-hidden">
      <div className="grid gap-1 sm:gap-2">
        <KeyFinder />
        <ChordFinder />
        <AIPal />
      </div>
    </div>
  )
}

