type YouTubeProps = {
  id: string
  title?: string
}

export const YouTube = ({ id, title = "YouTube video" }: YouTubeProps) => {
  if (!id) return null

  return (
    <div className="my-6 aspect-video overflow-hidden rounded-xl border border-jet bg-eerie-black-1">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
