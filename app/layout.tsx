import { site } from "./config";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: site.title,
    description: site.description,
    icons: `${site.url}/favicon.ico`,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className={inter.className}>{children}</div>
            </body>
        </html>
    );
}
