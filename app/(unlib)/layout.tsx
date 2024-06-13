// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Prata } from "next/font/google";
import { Yeseva_One } from "next/font/google";
import "@/app/globals.css";

const prata = Prata({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-prata",
    weight: "400",
});
const yeseva_one = Yeseva_One({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-yeseva_one",
    weight: "400",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={prata.variable + " " + yeseva_one.variable}>
            {children}
        </div>
    );
}
