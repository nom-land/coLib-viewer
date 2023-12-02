// components/Layout.js
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {children} {/* 页面内容插槽 */}
            </main>
            <div className="text-center mb-5">
                <div className="text-sm">
                    Powered by{" "}
                    <a
                        className="text-blue-500 hover:text-blue-800"
                        href="https://colib.app"
                    >
                        Colib.app
                    </a>
                </div>
            </div>
        </div>
    );
}
