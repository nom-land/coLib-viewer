"use client";

import { NotePack } from "nomland.js";
import SharingCard from "./sharingCard";

export default function CurationFeed(props: {
    feeds: NotePack[];
    showCommunity?: boolean;
    excludeRecord?: boolean;
}) {
    const { feeds, showCommunity, excludeRecord } = props;

    return (
        <div className="list-items gap-4">
            {feeds.map((cur, i) => (
                <SharingCard
                    key={i}
                    showCommunity={showCommunity}
                    note={cur.note}
                    user={cur.author}
                    community={cur.context}
                    entry={cur.entity}
                    excludeRecord={excludeRecord}
                ></SharingCard>
            ))}
        </div>
    );
}
