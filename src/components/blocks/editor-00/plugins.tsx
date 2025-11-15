import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { TRANSFORMERS } from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $getSelection, $isRangeSelection, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, TextFormatType, ElementFormatType } from "lexical"
import { $createCodeNode, getDefaultCodeLanguage, getCodeLanguages, registerCodeHighlighting } from "@lexical/code"
import { useCallback, useState, useEffect } from "react"
import type { ReactElement } from "react"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Italic, Link2, Link2Off, List, ListOrdered, Quote, Underline, Code } from "lucide-react"

// Enhanced URL matchers for better detection
const URL_MATCHER = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_~#?&//=]*)/g
const LOCALHOST_MATCHER = /https?:\/\/localhost(:[0-9]+)?(\/[^\s]*)?/g
const IP_URL_MATCHER = /https?:\/\/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]+)?(\/[^\s]*)?/g
const WWW_MATCHER = /www\.[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_~#?&//=]*)/g
const EMAIL_MATCHER = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
type Matcher = {
  index: number,
  length: number,
  text: string,
  url: string
} | null;

const MATCHERS = [
  // Match full HTTP/HTTPS URLs
  (text: string): Matcher => {
    URL_MATCHER.lastIndex = 0; // Reset regex
    const match = URL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch,
    }
  },
  // Match localhost URLs
  (text: string): Matcher => {
    LOCALHOST_MATCHER.lastIndex = 0; // Reset regex
    const match = LOCALHOST_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch,
    }
  },
  // Match IP-based URLs
  (text: string): Matcher => {
    IP_URL_MATCHER.lastIndex = 0; // Reset regex
    const match = IP_URL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch,
    }
  },
  // Match www URLs and add https
  (text: string): Matcher => {
    WWW_MATCHER.lastIndex = 0; // Reset regex
    const match = WWW_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `https://${fullMatch}`,
    }
  },
  // Match email addresses
  (text: string): Matcher => {
    EMAIL_MATCHER.lastIndex = 0; // Reset regex
    const match = EMAIL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `mailto:${fullMatch}`,
    }
  },
]

function ToolbarPlugin(): ReactElement {
  const [editor] = useLexicalComposerContext()
  const [isLink] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showCodeLanguageSelect, setShowCodeLanguageSelect] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(getDefaultCodeLanguage())

  const formatText = (format: TextFormatType): void => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatElement = (format: ElementFormatType): void => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format)
  }

  const formatHeading = (headingSize: HeadingTagType): void => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatQuote = (): void => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const formatList = (listType: string): void => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    }
  }

  const insertLink = useCallback((): void => {
    if (!isLink) {
      setShowLinkInput(true)
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const handleLinkSubmit = (): void => {
    if (linkUrl !== '') {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const handleLinkCancel = (): void => {
    setLinkUrl('')
    setShowLinkInput(false)
  }

  const formatCodeBlock = (): void => {
    // Immediately create a code block with the default language
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => {
          const codeNode = $createCodeNode(selectedLanguage)
          return codeNode
        })
      }
    })
    // Then show the language selector for changing if needed
    setShowCodeLanguageSelect(true)
  }

  const insertCodeBlock = (language: string): void => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => {
          const codeNode = $createCodeNode(language)
          return codeNode
        })
      }
    })
    setShowCodeLanguageSelect(false)
  }

  const handleCodeLanguageSelect = (language: string): void => {
    setSelectedLanguage(language)
    insertCodeBlock(language)
  }

  const availableLanguages = getCodeLanguages()

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap items-center gap-1 p-2">
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button variant="ghost" size="sm" onClick={() => formatText('bold')} className="h-8 w-8 p-0" title="Gras">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatText('italic')} className="h-8 w-8 p-0" title="Italique">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatText('underline')} className="h-8 w-8 p-0" title="Souligné">
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button variant="ghost" size="sm" onClick={() => formatHeading('h1')} className="h-8 w-8 p-0" title="Titre 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatHeading('h2')} className="h-8 w-8 p-0" title="Titre 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatQuote()} className="h-8 w-8 p-0" title="Citation">
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatCodeBlock()} className="h-8 w-8 p-0" title="Bloc de code">
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <Button variant="ghost" size="sm" onClick={() => formatElement('left')} className="h-8 w-8 p-0" title="Aligner à gauche">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatElement('center')} className="h-8 w-8 p-0" title="Centrer">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatElement('right')} className="h-8 w-8 p-0" title="Aligner à droite">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => formatList('bullet')} className="h-8 w-8 p-0" title="Liste à puces">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => formatList('number')} className="h-8 w-8 p-0" title="Liste numérotée">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={insertLink} className={`h-8 w-8 p-0 ${isLink ? 'bg-blue-100' : ''}`} title={isLink ? "Supprimer le lien" : "Ajouter un lien"}>
            {isLink ? <Link2Off className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showLinkInput && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Entrez l'URL (ex: https://exemple.com)"
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLinkSubmit()
                } else if (e.key === 'Escape') {
                  handleLinkCancel()
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleLinkSubmit} disabled={!linkUrl.trim()}>
              Ajouter
            </Button>
            <Button variant="outline" size="sm" onClick={handleLinkCancel}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      {showCodeLanguageSelect && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Changer le langage:</span>
            <Select
              value={selectedLanguage}
              onValueChange={handleCodeLanguageSelect}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setShowCodeLanguageSelect(false)}>
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Plugins({ placeholder = "Commencez à taper..." }: { placeholder?: string }): ReactElement {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Register code highlighting with Prism
    return registerCodeHighlighting(editor)
  }, [editor])

  return (
    <div className="h-full flex flex-col">
      <ToolbarPlugin />
      <div className="flex-1 relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-full outline-none p-3 resize-none overflow-auto" />
          }
          placeholder={
            <div className="absolute top-3 left-3 text-slate-500 pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin matchers={MATCHERS} />

      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <TabIndentationPlugin />
      <TablePlugin />
    </div>
  )
}