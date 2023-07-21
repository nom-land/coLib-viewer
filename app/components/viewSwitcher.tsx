"use client";

import SwitchBtn from "@/app/components/switchBtn";
import { useState } from "react";

export default function ViewSwitcher({
    children,
}: {
    children: JSX.Element[];
}) {
    const [analyzedView, setAnalyzedView] = useState(Boolean);
    return (
        <>
            <div className="relative h-10">
                <div className="absolute top-5 right-5 h-15 ">
                    <SwitchBtn
                        handleView={(choice) => setAnalyzedView(choice)}
                    ></SwitchBtn>
                </div>
            </div>
            <div className="container mx-auto my-5">
                {analyzedView ? children[1] : children[0]}
            </div>
        </>
    );
}
