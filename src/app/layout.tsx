import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "janawaaz.in | जनआवाज़ — श्री मोहन सिंह जी, बुड़ीवाड़ा",
  description: "जनआवाज़ (janawaaz.in) — ग्राम पंचायत बुड़ीवाड़ा के निवासियों के लिए निःशुल्क जन-संवाद, समस्या निवारण और पारदर्शी विकास सुझाव मंच। श्री मोहन सिंह जी (निर्दलीय सरपंच प्रत्याशी) द्वारा संचालित।",
  keywords: ["janawaaz.in", "जनआवाज़", "बुड़ीवाड़ा", "Budivada", "Mohan Singh Ji", "Sarpanch", "Gram Panchayat", "सरपंच प्रत्याशी", "जन-संवाद", "जन आवाज़"],
  authors: [{ name: "janawaaz.in — Team Mohan Singh Ji, Budivada" }],
  metadataBase: new URL("https://janawaaz.in"),
  openGraph: {
    title: "janawaaz.in | जनआवाज़ — बुड़ीवाड़ा जन-संवाद पोर्टल",
    description: "अपनी समस्याएँ बताएं, अपनी राय दें — श्री मोहन सिंह जी (निर्दलीय सरपंच प्रत्याशी, बुड़ीवाड़ा)",
    url: "https://janawaaz.in",
    siteName: "janawaaz.in",
    locale: "hi_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-village-200 selection:text-village-900">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
