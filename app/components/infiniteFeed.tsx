"use client";

import { CurationNote, CurationStat } from "nomland.js";
import CurationFeed from "./curationFeed";
import { useEffect, useState } from "react";
import { createNomland } from "../config/nomland";

// TODO: exported from nomland.js
interface Curation {
    n: CurationNote;
    record: {
        title: string;
    };
    stat: CurationStat;
}

const fetchNextFeeds = async (communityId: string, currentSkip: number) => {
    const nomland = createNomland();

    const { curationNotes } = await nomland.getFeeds(communityId, currentSkip);
    return curationNotes;
};

export default function InfiniteFeed(props: {
    initialNotes: Curation[];
    communityId: string;
}) {
    const { initialNotes, communityId } = props;

    const [items, setItems] = useState<Curation[]>(initialNotes || []);
    const [upcomingItems, setUpcomingItems] = useState<Curation[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(10);
    const [showUpBtn, setShowUpBtn] = useState<boolean>(false);
    const [loadMore, setLoadMore] = useState<boolean>(
        initialNotes.length === 10
    );

    async function fetchMoreData() {
        const nomoreData = (result: Curation[]) => {
            if (result.length < 10) {
                setLoadMore(false);
                setIsLoading(false);
                return true;
            }
            return false;
        };

        if (!loadMore) {
            return;
        }
        setIsLoading(true);

        if (upcomingItems.length > 0) {
            setItems((prevItems) => [...prevItems, ...upcomingItems]);
            setUpcomingItems([]);
            const curationNotes = await fetchNextFeeds(communityId, skip);
            setSkip(skip + 10);

            setUpcomingItems(curationNotes);

            if (nomoreData(curationNotes)) {
                return;
            }
        } else {
            let currentSkip = skip;
            const curationNotes = await fetchNextFeeds(
                communityId,
                currentSkip
            );
            setItems((prevItems) => [...prevItems, ...curationNotes]);

            if (nomoreData(curationNotes)) {
                return;
            }
            const upcomingNotes = await fetchNextFeeds(
                communityId,
                currentSkip + 10
            );
            setSkip(currentSkip + 20);

            setUpcomingItems(upcomingNotes);
            if (nomoreData(upcomingNotes)) {
                return;
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (
                document.documentElement.scrollTop >
                (window.innerHeight * 2) / 3
            ) {
                setShowUpBtn(true);
            } else {
                setShowUpBtn(false);
            }

            if (
                window.innerHeight + document.documentElement.scrollTop !==
                    document.documentElement.offsetHeight ||
                isLoading
            ) {
                return;
            }
            fetchMoreData();
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityId, isLoading, loadMore, upcomingItems, showUpBtn, skip]);

    useEffect(() => {
        const setup = async () => {
            // check if the current feed is newest, if not add it to the top
            setIsLoading(true);
            const feeds = await fetchNextFeeds(communityId, 0);
            const arr = [] as Curation[];
            for (let i = 0; i < feeds.length; i++) {
                if (initialNotes[0])
                    if (feeds[i].n.postId === initialNotes[0].n.postId) {
                        break;
                    } else {
                        arr.push(feeds[i]);
                    }
            }
            setItems((prevItems) => [...arr, ...prevItems]);
            setIsLoading(false);

            // initial load upcoming data
            fetchMoreData();
        };

        setup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <CurationFeed curationNotes={items} />
            {isLoading && (
                <div className="flex justify-center my-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
            )}
            {!loadMore && (
                <div className="text-center text-sm my-5">No more data</div>
            )}
            {showUpBtn && (
                <button
                    className="fixed bottom-5 md:right-10 right-5  bg-gray-500 text-white p-3 rounded-full"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                >
                    <u className="text-xl">↑</u>
                </button>
            )}
        </>
    );
}
