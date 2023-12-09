"use client";
import Image from "next/image";
import { useState } from "react";

export default function CharacterAvatar(props: {
    name: string;
    handle: string;
    avatar: string;
    size?: number;
}) {
    const { name, handle, size } = props;

    let avatar = props.avatar;

    let wrongAvatar = !avatar || false;

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

    return (
        <div className="flex gap-5">
            {imageError ? (
                <div className="rounded-full w-[40px] h-[40px] bg-gray-200 dark:bg-gray-500">
                    <div className="text-center text-white text-4xl">
                        {name[0]}
                    </div>
                </div>
            ) : (
                <Image
                    className="rounded-full"
                    src={avatar}
                    width={size || 50}
                    height={size || 50}
                    alt={handle}
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
}
