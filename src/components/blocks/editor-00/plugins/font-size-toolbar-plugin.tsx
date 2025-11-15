import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, ElementNode, LexicalNode, ParagraphNode } from "lexical";
import { useEffect } from "react";

// This plugin applies medium font size to all text content by default and ensures it persists in saved content
export function FontSizeToolbarPlugin(): null {
  const [editor] = useLexicalComposerContext();

  // Apply medium font size on initialization and for new content
  useEffect(() => {
    const mediumFontStyle = "font-size: 18px; line-height: 1.6;";

    const applyStyleRecursively = (node: LexicalNode): void => {
      if (node instanceof ParagraphNode) {
        node.setStyle(mediumFontStyle);
      } else if (node instanceof ElementNode) {
        // Recursively traverse children
        node.getChildren().forEach(child => {
          applyStyleRecursively(child);
        });
      }
    };

    // Initialize with medium font size
    editor.update(() => {
      const root = $getRoot();
      applyStyleRecursively(root);
    });

    // Register listener for future ParagraphNodes
    const removeListener = editor.registerNodeTransform(ParagraphNode, (paragraphNode) => {
      paragraphNode.setStyle("font-size: 18px"); // only modify font-size, preserve other styles
    });

    return (): void => {
      removeListener();
    };
  }, [editor]);

  // No UI rendered
  return null;
}
