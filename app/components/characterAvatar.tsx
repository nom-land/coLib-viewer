"use client";
import Image from "next/image";
import { useState } from "react";

export default function CharacterAvatar(props: {
    name: string;
    handle: string;
    avatar?: string;
    size?: "s" | "m" | "l";
}) {
    const { name, handle, size } = props;

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
    const [imageError, setImageError] = useState(wrongAvatar);

    let sizeNum = 40;

    let textClass = "text-center text-white text-3xl";
    let errImgClass =
        "relative rounded-full w-[40px] h-[40px] bg-gray-200 dark:bg-gray-500";
    if (size === "s") {
        sizeNum = 20;
        textClass = "text-center text-white";
        errImgClass =
            "relative rounded-full w-[20px] h-[20px] bg-gray-200 dark:bg-gray-500";
    } else if (size === "l") {
        sizeNum = 50;
        textClass = "text-center text-white text-4xl";
        errImgClass =
            "relative rounded-full w-[50px] h-[50px] bg-gray-200 dark:bg-gray-500";
    }

    return (
        <div className="relative">
            {imageError ? (
                <div className={errImgClass}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className={textClass}>
                            {name[0].toUpperCase()}
                        </span>
                    </div>
                </div>
            ) : (
                <Image
                    className="rounded-full"
                    src={avatar!}
                    width={sizeNum}
                    height={sizeNum}
                    alt={handle}
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
}
