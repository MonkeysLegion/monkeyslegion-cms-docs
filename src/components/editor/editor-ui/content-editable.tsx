import { cn } from "@/lib/utils"
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable"

type ContentEditableProps = {
  className?: string
}

export function ContentEditable({
  className,
  ...props
}: ContentEditableProps) {
  return (
    <LexicalContentEditable
      className={cn(
        "min-h-[120px] w-full resize-none outline-none text-sm leading-relaxed",
        "prose prose-sm max-w-none",
        "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-3",
        "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:my-2",
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  )
}
