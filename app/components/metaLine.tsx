"use client";

import TimeAgo from "react-timeago";

export function MetaLine({
    lastUpdated,
    l,
}: {
    lastUpdated: string;
    l: number;
}) {
    return (
        <div className="font-light text-sm">
            {l} {l > 1 ? "records" : "record"} | Updated{" "}
            <TimeAgo date={new Date(lastUpdated)} />
        </div>
    );
}
