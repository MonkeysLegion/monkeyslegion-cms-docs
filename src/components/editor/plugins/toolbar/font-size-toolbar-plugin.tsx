"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"

const DEFAULT_FONT_SIZE = "16px"
const MIN_FONT_SIZE = 1
const MAX_FONT_SIZE = 72

export function FontSizeToolbarPlugin() {
  const style = "font-size"
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)

  const { activeEditor } = useToolbarContext()

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        style,
        DEFAULT_FONT_SIZE
      )
      setFontSize(value) // always a string like "16px"
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const updateFontSize = useCallback(
    (newSize: number) => {
      const clamped = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE)
      const sizeString = `${clamped}px`
      activeEditor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: sizeString,
          })
        }
      })
      setFontSize(sizeString)
    },
    [activeEditor, style]
  )

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="!h-8 !w-8"
        onClick={() =>
          updateFontSize(parseInt(fontSize) - 1)
        }
        disabled={parseInt(fontSize) <= MIN_FONT_SIZE}
      >
        <MinusIcon className="size-3" />
      </Button>
      <Input
        name="fontSize"
        value={fontSize}
        onChange={(e) => {
          const numericValue = parseInt(e.target.value)
          updateFontSize(numericValue || MIN_FONT_SIZE)
        }}
        className="!h-8 w-12 text-center"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
      />
      <Button
        variant="outline"
        size="icon"
        className="!h-8 !w-8"
        onClick={() =>
          updateFontSize(parseInt(fontSize) + 1)
        }
        disabled={parseInt(fontSize) >= MAX_FONT_SIZE}
      >
        <PlusIcon className="size-3" />
      </Button>
    </div>
  )
}
