"use client";
import TimeAgo from "react-timeago";
import CharacterAvatar from "./characterAvatar";

export default function CharacterHeader(props: {
    name: string;
    handle: string;
    avatar?: string;
    id: string;
    date?: string;
    size?: "s" | "m" | "l";
}) {
    const { name, handle, avatar, date, id } = props;

    return (
        <div
            className="flex gap-3"
            onClick={(e) => {
                e.preventDefault();
                window.open(`/curator/${id.toString()}`, "_blank");
            }}
        >
            <CharacterAvatar name={name} handle={handle} avatar={avatar} />
            <div>
                <div>
                    <div className="group relative flex items-center font-extralight text-sm">
                        <div className="relative hover:bg-gray-200 rounded">
                            @
                            {handle.length > 14
                                ? handle.slice(0, 4) + "..." + handle.slice(-4)
                                : handle}
                            <div className="absolute text-xs hidden group-hover:block bg-gray-200 p-1 rounded mt-1 left-10">
                                @{handle}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
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
        </div>
    );
}
