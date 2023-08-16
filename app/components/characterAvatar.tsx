"use client";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

export default function CharacterAvatar(props: {
    name: string;
    handle: string;
    avatar: string;
    size?: number;
}) {
    const { name, handle, avatar, size } = props;
    return (
        <div className="flex gap-5">
            {/* TODO: default avatar */}
            <Image
                className="rounded-full"
                src={avatar}
                width={size || 50}
                height={size || 50}
                alt={handle}
            />
        </div>
    );
}
