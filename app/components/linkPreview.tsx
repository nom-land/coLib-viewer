"use client";
import { forwardRef, useEffect, useRef, useState } from "react";
import useHasBeenInViewport from "../utils/useHasBeenInViewport";
import Image from "next/image";

type RequestStatus = "idle" | "loading" | "success" | "error";

type UrlData = {
    title: string;
    description: string | null;
    favicon: string | null;
    imageSrc: string | null;
};

function useUnfurlUrl(url: string, enabled: boolean) {
    const [status, setStatus] = useState<RequestStatus>("idle");
    const [data, setData] = useState<null | UrlData>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const encoded = encodeURIComponent(url);
        fetch(`/api/preview?url=${encoded}`)
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setData(data);
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            })
            .catch((error) => {
                console.error(error);
                setStatus("error");
            });
    }, [url, enabled]);

    return { status, data };
}

function UnfurledUrlPreview({
    url,
    urlData,
}: {
    url: string;
    urlData: UrlData;
}) {
    if (urlData.imageSrc)
        urlData.imageSrc = urlData.imageSrc?.replace("http://", "https://");
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);
    return (
        <>
            {domLoaded && (
                <div>
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(url, "_blank");
                        }}
                    >
                        <div
                            className="mb-4 bg-callout-background max-h-[89px] md:max-h-[109px] p-0 overflow-hidden hover:bg-callout-background-focused transition-background duration-200 ease-in-out flex flex-row border rounded-[16px]"
                            data-url={url}
                        >
                            {urlData.imageSrc && (
                                <div className="relative w-[89px] h-[89px] md:w-[109px] md:h-[109px] flex-shrink-0">
                                    <Image
                                        src={urlData.imageSrc}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="100%"
                                        alt="Website preview"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            <div className={`p-3`}>
                                <div className="flex items-center gap-2 overflow-hidden w-full">
                                    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis text-md text-gray-500 font-normal text-sm">
                                        {new URL(url).hostname}
                                    </span>
                                </div>

                                {urlData.title && (
                                    <span
                                        className="break-words overflow-hidden"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            ...(window.innerWidth >= 768
                                                ? {
                                                      WebkitLineClamp: "1",
                                                  }
                                                : {
                                                      WebkitLineClamp: "2",
                                                  }),
                                        }}
                                    >
                                        {urlData.title}
                                    </span>
                                )}

                                {urlData.description && (
                                    <div
                                        className="invisible md:visible text-sm overflow-hidden text-gray-500 font-normal text-sm"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: "2",
                                        }}
                                    >
                                        {urlData.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const BookmarkFallback = forwardRef<HTMLDivElement, { url: string }>(
    function BookmarkFallbackInner({ url }, ref) {
        return (
            <div
                className="flex mb-4 p-3 rounded-sm bg-blue border border-border"
                ref={ref}
            >
                <span className="break-words overflow-hidden">{url}</span>
            </div>
        );
    }
);

export default function LinkPreview({ url }: { url: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const enabled = useHasBeenInViewport(ref as any); //TODO

    const { data, status } = useUnfurlUrl(url, enabled);

    if (status === "success") {
        return <UnfurledUrlPreview url={url} urlData={data as any} />; //TODO
    }

    return <BookmarkFallback url={url} ref={ref} />;
}
