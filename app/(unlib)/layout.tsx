import { site } from "../config";
import "@/app/globals.css";
import { Inter } from "next/font/google";

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
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
                <div className={inter.className}>{children}</div>
            </div>
        </div>
    );
}
