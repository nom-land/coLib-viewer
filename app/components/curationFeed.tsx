"use client";

import { FeedNote } from "../utils";
import SharingCard from "./sharingCard";

export default function CurationFeed(props: {
    feeds: FeedNote[];
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
                    user={cur.user}
                    community={cur.community}
                    entry={cur.entry}
                    excludeRecord={excludeRecord}
                ></SharingCard>
            ))}
        </div>
    );
}
