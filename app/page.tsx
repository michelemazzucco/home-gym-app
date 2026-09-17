'use client'

import { useEffect, useState } from 'react'
import { useObjectUrl } from './lib/useObjectUrl'
import { cn } from './lib/utils'
import { toast } from 'sonner'
import { useApp } from './context/AppContext'
import { planToMarkdown } from './lib/workout'
import { copyText } from './utils'
import {
  PaperSheet,
  PhotoDropzone,
  PhotoPreview,
  SiteHeader,
  StepEquipment,
  StepIndicator,
  StepPlanSummary,
  StepSettings,
  UploadHint,
} from './components'
import { Button } from './components/ui/button'
import { ArrowLeft, ArrowRight, Copy, Loader2, RotateCcw, Share2 } from 'lucide-react'

const imageKeyOf = (file: File) => `${file.name}-${file.size}-${file.lastModified}`

const readError = async (response: Response, fallback: string) => {
  try {
    const body = await response.json()
    return typeof body?.error === 'string' ? body.error : fallback
  } catch {
    return fallback
  }
}

export default function Home() {
  const {
    step,
    setStep,
    selectedImage,
    setSelectedImage,
    difficulty,
    sessionsPerWeek,
    weeks,
    sessionMinutes,
    equipment,
    setEquipment,
    plan,
    commitPlan,
    apiKey,
    analyzedImageKey,
    resetState,
  } = useApp()

  const [unticked, setUnticked] = useState<string[]>([])
  const selected = equipment.filter((item) => !unticked.includes(item))
  const [loading, setLoading] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const previewUrl = useObjectUrl(selectedImage)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const identifyEquipment = async () => {
    if (!selectedImage) {
      toast('Upload a photo to get started!')
      return
    }

    const key = imageKeyOf(selectedImage)
    if (analyzedImageKey === key) {
      setUnticked([])
      setStep(2)
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      if (apiKey) formData.append('apiKey', apiKey)

      const response = await fetch('/api/equipment', { method: 'POST', body: formData })
      if (!response.ok) {
        throw new Error(await readError(response, 'Could not read the photo. Please try again.'))
      }

      const data = (await response.json()) as { equipment: string[]; mock?: boolean }
      setUsingMockData(Boolean(data.mock))
      setEquipment(data.equipment, key)
      setUnticked([])
      setStep(2)
    } catch (error) {
      console.error('Error identifying equipment:', error)
      toast(error instanceof Error ? error.message : 'Could not read the photo.')
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment: selected,
          difficulty,
          sessionsPerWeek,
          weeks,
          sessionMinutes,
          apiKey: apiKey || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(await readError(response, 'Could not build the plan. Please try again.'))
      }

      const data = (await response.json()) as {
        plan: Parameters<typeof commitPlan>[1]
        mock?: boolean
      }
      setUsingMockData(Boolean(data.mock))
      commitPlan(selected, data.plan)
    } catch (error) {
      console.error('Error generating plan:', error)
      toast(error instanceof Error ? error.message : 'Could not build the plan.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!plan) return
    copyText(planToMarkdown(equipment, plan), (message) => toast(message))
  }

  const handleShare = async () => {
    if (!plan) return
    try {
      await navigator.share({ title: 'My Homegym plan', text: planToMarkdown(equipment, plan) })
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') {
        toast('Could not open the share sheet.')
      }
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pt-6 pb-36 sm:px-8 sm:pt-10 lg:gap-24 lg:px-6 lg:py-20">
      <SiteHeader />

      <main className="flex flex-col gap-8 lg:gap-12">
        <div className="flex flex-wrap items-center gap-4">
          <StepIndicator current={step} onSelect={loading ? undefined : setStep} />
          {usingMockData && (
            <span className="animate-pop rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-sm text-accent motion-reduce:animate-none">
              Mock data — OpenAI was not called
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16">
          <div
            key={`panel-${step}`}
            className="animate-rise motion-reduce:animate-none max-lg:order-1 lg:col-start-1 lg:row-start-1"
          >
            {step === 1 && <StepSettings />}
            {step === 2 && (
              <StepEquipment
                selected={selected}
                onToggle={(item) =>
                  setUnticked((prev) =>
                    prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]
                  )
                }
                onAdd={(item) => {
                  if (equipment.includes(item)) return
                  setEquipment([...equipment, item])
                }}
                onRemove={(item) => {
                  setEquipment(equipment.filter((entry) => entry !== item))
                  setUnticked((prev) => prev.filter((entry) => entry !== item))
                }}
              />
            )}
            {step === 3 && <StepPlanSummary equipment={equipment} />}
          </div>

          <div
            key={`media-${step}`}
            className={cn(
              'lg:col-start-2 lg:row-span-2 lg:row-start-1',
              // On small screens the plan is long, so the actions come before it.
              step === 3 ? 'max-lg:order-3' : 'max-lg:order-2',
              // The plan sheet staggers its own blocks in, so it opts out here.
              step !== 3 && 'animate-rise motion-reduce:animate-none'
            )}
          >
            {step === 1 && (
              <div className="relative">
                {!selectedImage && <UploadHint />}
                <PhotoDropzone previewUrl={previewUrl} onSelect={setSelectedImage} />
              </div>
            )}
            {step === 2 && <PhotoPreview previewUrl={previewUrl} />}
            {step === 3 && plan && <PaperSheet plan={plan} />}
          </div>

          <div
            key={`actions-${step}`}
            className={cn(
              'flex animate-rise flex-wrap items-center gap-3 delay-75 motion-reduce:animate-none lg:col-start-1 lg:row-start-2 lg:pt-8',
              // On small screens the actions ride at the bottom of the viewport. The bar itself
              // is see-through to clicks; only the buttons in it are not.
              'max-lg:pointer-events-none max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-20 max-lg:bg-gradient-to-t max-lg:from-ink-deep max-lg:from-40% max-lg:to-transparent max-lg:px-6 max-lg:pt-20 max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-lg:[&>*]:pointer-events-auto',
              step === 3 ? 'max-lg:order-2' : 'max-lg:order-3 lg:self-end lg:pb-1'
            )}
          >
            {step === 1 && (
              <Button
                className="flex-1 lg:ml-auto lg:flex-none"
                onClick={identifyEquipment}
                disabled={loading || !selectedImage}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Reading the photo
                  </>
                ) : (
                  <>
                    Next step
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            )}

            {step === 2 && (
              <>
                <Button
                  variant="secondary"
                  className="max-lg:w-[41px] max-lg:px-0!"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  aria-label="Previous step"
                >
                  <ArrowLeft className="size-4" />
                  <span className="max-lg:hidden">Previous step</span>
                </Button>
                <Button
                  className="flex-1 lg:ml-auto lg:flex-none"
                  onClick={generatePlan}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Writing the plan
                    </>
                  ) : (
                    <>
                      Next step
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Button
                  variant="secondary"
                  className="max-lg:w-[41px] max-lg:px-0!"
                  onClick={resetState}
                  aria-label="Create new one"
                >
                  <RotateCcw className="size-4" />
                  <span className="max-lg:hidden">Create new one</span>
                </Button>
                {canShare && (
                  <Button
                    variant="secondary"
                    className="max-lg:w-[41px] max-lg:px-0!"
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <Share2 className="size-4" />
                    <span className="max-lg:hidden">Share</span>
                  </Button>
                )}
                <Button className="flex-1 lg:flex-none" onClick={handleCopy}>
                  <Copy className="size-4" />
                  Copy workout
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
