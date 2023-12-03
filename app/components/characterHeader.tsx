"use client";
import TimeAgo from "react-timeago";
import CharacterAvatar from "./characterAvatar";

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
            {/* <Image
                className="rounded-full"
                src={avatar}
                width={size || 50}
                height={size || 50}
                alt={handle}
            /> */}
            <CharacterAvatar name={name} handle={handle} avatar={avatar} />
            <div>
                <div>
                    <div className="font-extralight text-sm truncate">
                        @
                        {handle.length > 14
                            ? handle.slice(0, 4) + "..." + handle.slice(-4)
                            : handle}
                    </div>
                    <div className="flex gap-1">
                        <div className="font-bold text-xl truncate max-w-[9rem] items-end flex">
                            {name.endsWith("undefined")
                                ? name.split(" ")[0]
                                : name}{" "}
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
