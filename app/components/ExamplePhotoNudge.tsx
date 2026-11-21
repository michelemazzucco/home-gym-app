/* Positioned below the dropzone's centred upload button. Only the link takes clicks, so the
   rest of the line still opens the file picker underneath. */
export const ExamplePhotoNudge = ({ onTry }: { onTry: () => void }) => (
  <p className="pointer-events-none absolute inset-x-6 top-[calc(50%+2.25rem)] text-center font-hand text-[22px] leading-6 text-scribble [word-spacing:0.08em]">
    Nothing to snap right now? <br className="sm:hidden" />
    <button
      type="button"
      onClick={onTry}
      className="pointer-events-auto touch-target relative cursor-pointer rounded-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Try mine.
      <ScribbleLine className="pointer-events-none absolute inset-x-0 -bottom-1 h-1.5 w-full text-accent" />
    </button>
  </p>
)

const ScribbleLine = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 6"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M1.5 3.6C14 2.4 27 2.1 41 3.2s27 1.4 41 .3c12-.9 23-1.2 36.5-.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)
