import Link from "next/link"
import Image from "next/image"

const Footer = ({ className = "" }) => {
  return (
    <footer className={`border-t border-border bg-background ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-muted-foreground">
              © 2025 Monkeys Legion CMS. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <Image
                src="/MonkeysLegion.svg"
                alt="MonkeysLegion"
                width={120}
                height={24}
                className="h-5 w-auto text-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm hover:text-foreground transition-colors text-muted-foreground"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com"
              className="text-sm hover:text-foreground transition-colors text-muted-foreground"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer