import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "श्री मोहन सिंह जी | बुड़ीवाड़ा निर्दलीय सरपंच प्रत्याशी जन-संवाद एवं समस्या निवारण पोर्टल",
  description: "ग्राम पंचायत बुड़ीवाड़ा के निवासियों के लिए निःशुल्क जन-संवाद, समस्या निवारण और पारदर्शी विकास सुझाव मंच - श्री मोहन सिंह जी (निर्दलीय सरपंच प्रत्याशी)",
  keywords: ["बुड़ीवाड़ा", "Budivada", "Mohan Singh Ji", "Sarpanch", "Gram Panchayat", "सरपंच प्रत्याशी", "जन-संवाद"],
  authors: [{ name: "Team Mohan Singh Ji, Budivada" }],
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
