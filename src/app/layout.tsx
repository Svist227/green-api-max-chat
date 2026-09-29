import type { Metadata } from "next";
import { Providers } from "../store/AuthContext";
import { manrope } from './fonts'




export const metadata: Metadata = {
  title: "Minix",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={manrope.variable}>
              
              <Providers>

        {children}
      </Providers>

      </body>
       
    </html>
  );
}
