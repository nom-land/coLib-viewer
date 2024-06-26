"use client";

import CurationFeed from "./curationFeed";
import { useEffect, useState } from "react";
import { createNomland } from "../app/config/nomland";
import { InView } from "react-intersection-observer";
import { MetaLine } from "./metaLine";
import { getFeeds, getId } from "../app/utils";
import { NotePack } from "nomland.js";

const fetchNextFeeds = async (params: {
    communityId?: string;
    tag?: string;
    curatorId?: string;
    cur?: string;
}) => {
    const { communityId, tag, curatorId, cur } = params;
    try {
        const nomland = createNomland();
        const options = cur ? { cursor: cur } : {};
        const feedsData = await nomland.getFeeds(
            {
                context: communityId,
                character: curatorId,
                tag,
            },
            options
        );

        const { feeds } = getFeeds(feedsData);
        return feeds;
    } catch (e) {
        console.error(
            "fetchNextFeeds(" + communityId + ", " + cur + ") fails: ",
            e
        );
        return [];
    }
};

export default function InfiniteFeed(props: {
    initialNotes: NotePack[];
    showCommunity: boolean;
    communityId?: string;
    curatorId?: string;
    tag?: string;
}) {
    const { initialNotes, communityId, tag, curatorId, showCommunity } = props;

    const [items, setItems] = useState<NotePack[]>(initialNotes || []);
    const [upcomingItems, setUpcomingItems] = useState<NotePack[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [skip, setSkip] = useState<number>(10);
    const [showUpBtn, setShowUpBtn] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(initialNotes.length === 10);

    const [effectComplete, setEffectComplete] = useState<boolean>(false);
    const [inView, setInView] = useState(false);

    const [lastUpdated, setLastUpdated] = useState<string>(
        initialNotes[0]?.note.details.date_published || ""
    );

    async function fetchMoreData(firstLoad?: boolean) {
        const hasMoreData = (result: NotePack[]) => {
            if (result.length < 10) {
                setHasMore(false);
                setIsLoading(false);
                return false;
            }
            return true;
        };

        setIsLoading(true);

        if (upcomingItems.length > 0) {
            if (firstLoad) {
                setIsLoading(false);
                return;
            }

            const cur = getId(upcomingItems[upcomingItems.length - 1].note.key);

            setItems((prevItems) => [...prevItems, ...upcomingItems]);
            setUpcomingItems([]);
            const curationNotes = await fetchNextFeeds({
                communityId,
                tag,
                curatorId,
                cur,
            });
            console.log("next notes: ", curationNotes);
            setSkip(skip + 10);

            setUpcomingItems(curationNotes);

            if (!hasMoreData(curationNotes)) {
                return;
            }
        } else {
            let currentSkip = skip;

            if (!hasMoreData(initialNotes)) {
                return;
            }

            let cur = getId(initialNotes[initialNotes.length - 1].note.key);

            const curationNotes = await fetchNextFeeds({
                communityId,
                tag,
                curatorId,
                cur,
            });

            setItems((prevItems) => [...prevItems, ...curationNotes]);

            if (!hasMoreData(curationNotes)) {
                return;
            }

            cur = getId(curationNotes[curationNotes.length - 1].note.key);
            const upcomingNotes = await fetchNextFeeds({
                communityId,
                tag,
                curatorId,
                cur,
            });
            setSkip(currentSkip + 20);

            setUpcomingItems(upcomingNotes);
            if (!hasMoreData(upcomingNotes)) {
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
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communityId, isLoading, hasMore, upcomingItems, showUpBtn, skip]);

    useEffect(() => {
        const setup = async () => {
            // check if the current feed is newest, if not add it to the top
            setIsLoading(true);
            const feeds = await fetchNextFeeds({ communityId, tag, curatorId });

            const arr = [] as NotePack[];

            if (feeds[0]?.note.details.date_published)
                setLastUpdated(feeds[0].note.details.date_published);

            console.log(
                "fetch recent notes, initialNotes[0]: ",
                initialNotes[0]
            );
            for (let i = 0; i < feeds.length; i++) {
                if (initialNotes[0])
                    if (
                        getId(feeds[i].note.key) ===
                        getId(initialNotes[0].note.key)
                    ) {
                        break;
                    } else {
                        arr.push(feeds[i]);
                    }
            }
            setItems((prevItems) => [...arr, ...prevItems]);
            setIsLoading(false);

            // initial load upcoming data
            fetchMoreData(true);
        };

        setup().then(() => {
            setEffectComplete(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const checkAndFetch = async () => {
            if (inView && !isLoading && hasMore && effectComplete) {
                fetchMoreData();
            }
        };

        checkAndFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, inView]);

    const handleInView = (inView: boolean) => {
        setInView(inView);
    };

    return (
        <>
            {/* div float right  */}
            <div className="my-3">
                <MetaLine lastUpdated={lastUpdated} l={0} />
            </div>
            <CurationFeed feeds={items} showCommunity={showCommunity} />
            <InView as="div" onChange={handleInView}>
                {isLoading && (
                    <div className="flex justify-center my-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                )}
            </InView>

            {!isLoading && !hasMore && (
                <div className="text-center text-sm my-5">
                    <span className="text-gray-500">- No more data -</span>
                </div>
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
