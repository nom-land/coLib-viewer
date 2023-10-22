"use client";
import Image from "next/image";
import TimeAgo from "react-timeago";

export default function CharacterHeader(props: {
    name: string;
    handle: string;
    avatar: string;
    date?: string;
    size?: number;
}) {
    const { name, handle, avatar, date, size } = props;
    return (
        <div className="flex gap-3">
            {/* TODO: default avatar */}
            <Image
                className="rounded-full"
                src={avatar}
                width={size || 50}
                height={size || 50}
                alt={handle}
            />
            <div>
                <div>
                    <div className="font-extralight text-sm truncate">
                        @{handle}
                    </div>
                    <div className="flex gap-1">
                        <div className="font-bold text-xl truncate max-w-[9rem] items-end flex">
                            {name}{" "}
                        </div>
                        <div className="flex items-end">
                            {date && <TimeAgo date={new Date(date)} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
