"use client";

import { AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

export default function UserAvatar(props: {
    name: string;
    handle: string;
    avatar?: string;
    width: number;
    height: number;
}) {
    const { name, handle, width, height } = props;
    let avatar = props.avatar;

    let wrongAvatar = !avatar || false;

    if (!avatar) {
        wrongAvatar = true;
    }

    if (
        avatar?.startsWith("https://") ||
        avatar?.startsWith("http://") ||
        avatar?.startsWith("/") ||
        avatar?.startsWith("./")
    ) {
    } else if (avatar?.startsWith("ipfs://")) {
        avatar = `https://ipfs.crossbell.io/ipfs/${avatar.slice(7)}`;
    } else {
        wrongAvatar = true;
    }
    console.log(avatar);
    const [imageError, setImageError] = useState(wrongAvatar);

    let textClass = "text-center text-white text-3xl";
    let errImgClass =
        "relative rounded-full w-[40px] h-[40px] bg-gray-200 dark:bg-gray-500";

    return (
        <div className="relative">
            {imageError ? (
                // <div className={errImgClass}>
                //     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                //         <span className={textClass}>
                //             {(name[0] || "U").toUpperCase()}
                //         </span>
                //     </div>
                // </div>
                <AvatarFallback>
                    {(name[0] || "U").toUpperCase()}
                </AvatarFallback>
            ) : (
                <Image
                    className="rounded-full"
                    src={avatar!}
                    width={width}
                    height={height}
                    alt={handle}
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
}
