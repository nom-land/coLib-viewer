"use client";
import Image from "next/image";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

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
