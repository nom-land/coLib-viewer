"use client";

import CharacterAvatar from "./characterAvatar";

export function CommunityAvatar(props: {
    name: string;
    handle: string;
    avatar: string;
    communityId: string;
    size?: "s" | "m" | "l";
    excludeName?: boolean;
}) {
    const { name, handle, avatar, size, communityId } = props;
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                window.open(`/community/${communityId}`, "_blank");
            }}
            className="cursor-pointer"
        >
            <div className="flex gap-3 my-3">
                <div className="relative group">
                    <CharacterAvatar
                        name={name}
                        handle={handle}
                        avatar={avatar}
                        size={size}
                    />
                    {props.excludeName && (
                        <div className="absolute text-xs hidden group-hover:block bg-gray-200 p-1 rounded mt-1 left-10">
                            {name}
                        </div>
                    )}
                </div>

                {!props.excludeName && (
                    <div className="flex items-center">
                        <span className="text-3xl">{name}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
