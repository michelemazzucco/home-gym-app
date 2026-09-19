'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from './ui/button'
import { InfoDialog } from './InfoDialog'

const REPO_URL = 'https://github.com/michelemazzucco/home-gym-app'

export const SiteHeader = () => {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <header className="flex flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-6">
      <h1 className="font-display text-[40px] leading-[1em] font-medium text-chalk">Homegym</h1>
      <div className="relative mt-1 w-fit">
        <p className="font-display text-base text-accent sm:text-xl sm:leading-6">
          Workouts based on what&rsquo;s around you
        </p>
        <Squiggle className="pointer-events-none absolute right-0 -bottom-3 h-auto w-10 translate-x-2 text-accent sm:-bottom-4 sm:w-12" />
      </div>

      <div className="order-first mb-2 flex items-center gap-2 self-end sm:order-none sm:col-start-2 sm:row-start-1 sm:row-end-3 sm:mb-0 sm:gap-4 sm:self-start">
        <Button
          variant="icon"
          size="icon"
          className="size-9 sm:size-11"
          asChild
          aria-label="Open the repository on GitHub"
        >
          <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
            <GithubMark className="size-4 sm:size-5" />
          </a>
        </Button>
        <Button
          variant="icon"
          size="icon"
          className="size-9 sm:size-11"
          onClick={() => setInfoOpen(true)}
          aria-label="About this app"
        >
          <Info className="size-4 sm:size-5" />
        </Button>
      </div>

      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </header>
  )
}

const GithubMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.635 22.412c.575.106.785-.25.785-.554 0-.273-.01-.997-.015-1.957-3.199.695-3.874-1.542-3.874-1.542-.523-1.33-1.278-1.684-1.278-1.684-1.044-.714.079-.7.079-.7 1.154.082 1.762 1.186 1.762 1.186 1.026 1.758 2.693 1.25 3.35.956.104-.744.401-1.25.73-1.538-2.553-.291-5.238-1.278-5.238-5.687 0-1.256.449-2.283 1.185-3.088-.119-.291-.514-1.462.113-3.047 0 0 .966-.31 3.165 1.18a10.98 10.98 0 0 1 5.762 0c2.198-1.49 3.163-1.18 3.163-1.18.628 1.585.233 2.756.114 3.047.738.805 1.183 1.832 1.183 3.088 0 4.42-2.689 5.392-5.25 5.678.413.355.78 1.056.78 2.129 0 1.537-.014 2.776-.014 3.153 0 .307.207.665.79.552A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

const Squiggle = ({ className }: { className?: string }) => (
  <svg
    width="48"
    height="12"
    viewBox="0 0 48.09 11.23"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M0 5.469C2.395 4.725 12.466 2.88 26.782 1.585 34.717.868 40.607.059 46.69.001 54.638-.075 26.43 4.361 21.24 5.616c-4.968 1.202-9.952 3.332-15.438 4.725-1.299.33-2.387.968-.313.883 16.432-1.858 26.511-2.701 32.702-3.334 1.47-.211 2.709-.489 3.985-.776"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)
