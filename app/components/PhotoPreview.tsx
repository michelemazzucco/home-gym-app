export const PhotoPreview = ({ previewUrl }: { previewUrl: string | null }) => (
  <div className="flex min-h-[280px] w-full items-center justify-center rounded-lg border border-dashed border-white/40 bg-white/[0.03] p-6 lg:min-h-media">
    {previewUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl}
        alt="The equipment you uploaded"
        className="max-h-[240px] w-auto animate-pop rounded-lg object-contain motion-reduce:animate-none lg:max-h-[412px]"
      />
    ) : (
      <p className="text-base text-muted-foreground">No photo</p>
    )}
  </div>
)
