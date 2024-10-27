import type { Metadata } from "next"
import "./globals.sass"

export const metadata: Metadata = {
  title: "Hangman",
  description: "Jogo da Forca",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5737711449293910"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
