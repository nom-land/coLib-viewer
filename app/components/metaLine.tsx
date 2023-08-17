"use client";

import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
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
            <ReactTimeAgo date={new Date(lastUpdated)} />
        </div>
    );
}
