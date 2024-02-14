"use client";
import TimeAgo from "react-timeago";
import CharacterAvatar from "./characterAvatar";
import { UserInfo } from "nomland.js";

export default function UserHeader(props: {
    user: UserInfo;
    date?: string;
    size?: "s" | "m" | "l";
    onlyAvatar?: boolean;
}) {
    const { user, onlyAvatar, date } = props;

    const name = user.metadata.name || "Unknown";
    const handle = user.handle;
    const avatar = user.metadata.avatars ? user.metadata.avatars[0] : "";
    const id = user.characterId;

    return (
        <div className="flex gap-3 cursor-pointer">
            <div
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`/curator/${id.toString()}`, "_blank");
                }}
                className="cursor-pointer"
            >
                <CharacterAvatar name={name} handle={handle} avatar={avatar} />
            </div>

            {!onlyAvatar && (
                <div>
                    <div>
                        <div className="group relative flex items-center font-extralight text-sm">
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`/curator/${id}`, "_blank");
                                }}
                                className="relative hover:bg-gray-200 rounded"
                            >
                                @
                                {handle.length > 14
                                    ? handle.slice(0, 4) +
                                      "..." +
                                      handle.slice(-4)
                                    : handle}
                                <div className="absolute text-xs hidden group-hover:block bg-gray-200 p-1 rounded mt-1 left-10">
                                    @{handle}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="font-bold text-xl truncate max-w-[9rem] items-end flex">
                                <div
                                    className="hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(`/curator/${id}`, "_blank");
                                    }}
                                >
                                    {name.endsWith("undefined")
                                        ? name.split(" ")[0]
                                        : name}{" "}
                                </div>
                            </div>
                            <div className="flex items-end">
                                {date && <TimeAgo date={new Date(date)} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
