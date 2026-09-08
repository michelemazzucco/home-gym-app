/**
 * The hand-written cue from the design. On desktop it sits in the gutter to the left of the
 * dropzone; on mobile there is no gutter, so it stacks above the panel and the arrow turns
 * to point down into it.
 */
export const UploadHint = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none mb-3 flex items-end gap-1 pl-2 text-white/20 lg:absolute lg:-top-4 lg:right-full lg:mr-3 lg:mb-0 lg:flex-col lg:items-end lg:pl-0"
  >
    <span className="-rotate-11 font-hand text-[28px] leading-[34px] whitespace-nowrap">
      Upload here
    </span>
    <svg
      width="30"
      height="34"
      viewBox="0 0 30 34"
      fill="none"
      className="mb-1 rotate-[28deg] lg:-mt-1 lg:mr-4 lg:mb-0 lg:-rotate-[22deg]"
    >
      <path
        d="M0 0C0 4.234 0.598 8.691 3.716 14.573C8.404 23.414 13.648 26.385 17.733 28.984C24.021 32.985 26.919 33.585 27.736 33.718C30.016 34.089 21.155 31.013 15.411 30.904C8.297 30.768 25.419 34.165 29.915 33.994C30.266 32.665 29.489 30.658 28.33 28.555C27.666 27.546 26.848 26.658 24.355 24.396"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </div>
)
