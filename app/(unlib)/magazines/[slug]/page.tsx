import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { serviceEndpoint } from "@/app/config";
import { Feeds } from "nomland.js";
import { getFeeds } from "@/app/utils";
import LinkPreview from "@/components/linkPreview";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    const data = await getData(slug);

    const title = data.magazine.title;
    const description = data.magazine.subTitle;
    return {
        title,
        description,
    };
}

export interface Magazine {
    title: string;
    subTitle: string;
    slug: string;
    curator: string;
    preface: string;
    banner: string;
    uid: string;
}

async function getData(slug: string) {
    // fetch data from endpoint
    const data = await fetch(serviceEndpoint + "/magazine/" + slug, {
        next: { revalidate: 60 }, // 60 seconds = 1 minutes
    });
    const magazineContents = await data.json();
    return magazineContents as {
        feeds: Feeds;
        magazine: Magazine;
    };
}

export default async function Magazine(props: { params: { slug: string } }) {
    const { slug } = props.params;
    const magazineContents = await getData(slug);
    // TODO: change to record
    const entityIdRecords = magazineContents.feeds
        .entityIdMaps as any as Record<string, string>;
    const entityIdMaps = Object.entries(entityIdRecords).reduce(
        (acc, [key, value]) => {
            acc.set(key, value);
            return acc;
        },
        new Map<string, string>()
    );
    magazineContents.feeds.entityIdMaps = entityIdMaps;
    // TODO: END

    const feedsData = getFeeds(magazineContents.feeds);
    const magazine = magazineContents.magazine;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-12">
            <div className="w-full flex flex-col gap-8 md:gap-12">
                <div className="max-w-full text-center space-y-4">
                    <div className="w-full aspect-w-3 aspect-h-2 md:aspect-w-2 md:aspect-h-1">
                        <img
                            src={magazine.banner}
                            alt="description"
                            className="w-full object-cover"
                        />
                    </div>
                    {/* <div className="max-w-full aspect-w-3 aspect-h-2">
                        <img
                            src={magazine.banner}
                            alt="Banner"
                            // className="w-full max-h-60 object-cover"
                            className="object-cover"
                        />
                    </div> */}
                    {/* <Image
                        src={magazine.banner}
                        alt="Banner"
                        className="w-full "
                        objectFit="cover"
                        height={12}
                        width={800}
                        // sizes="100vw"
                        // style={{
                        //     width: "100%",
                        //     height: "auto",
                        // }}
                    /> */}

                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        {magazine.title}
                        <div className="text-lg font-medium text-gray-500 dark:text-gray-400 mt-2">
                            {magazine.subTitle}
                        </div>
                    </h1>
                </div>
                <div className="flex flex-col gap-6 md:gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-left">
                            Curator&apos;s Introduction
                        </h2>
                        <p className="whitespace-pre-line text-left">
                            {magazine.preface}
                        </p>
                        <div className="space-y-2">
                            <p className="text-gray-500 dark:text-gray-400">
                                by {magazine.curator}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Curation List
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 md:gap-8 p-2 rounded-lg">
                        {feedsData.feeds.map((feed, index) => (
                            <div className="space-y-2" key={index}>
                                <div className="flex">
                                    <div className="space-y-2 w-180">
                                        <Avatar className="w-12 h-12 mr-2 rounded-full">
                                            {/* <UserAvatar
                                                name={
                                                    feed.author.metadata.name ||
                                                    ""
                                                }
                                                handle={feed.author.handle}
                                                avatar={
                                                    feed.author.metadata.avatars
                                                        ? feed.author.metadata
                                                              .avatars[0]
                                                        : ""
                                                }
                                                width={40}
                                                height={40}
                                            /> */}
                                            {feed.author.metadata.avatars ? (
                                                <img
                                                    src={
                                                        feed.author.metadata
                                                            .avatars
                                                            ? feed.author.metadata.avatars[0].startsWith(
                                                                  "ipfs://"
                                                              )
                                                                ? `https://ipfs.crossbell.io/ipfs/${feed.author.metadata.avatars[0].slice(
                                                                      7
                                                                  )}`
                                                                : feed.author
                                                                      .metadata
                                                                      .avatars[0]
                                                            : ""
                                                    }
                                                    alt={
                                                        feed.author.metadata
                                                            .name
                                                    }
                                                />
                                            ) : (
                                                <div className="relative rounded-full w-12 h-12 bg-gray-200 dark:bg-gray-500">
                                                    {" "}
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        {" "}
                                                        <span className="text-center text-white text-3xl">
                                                            {" "}
                                                            {(feed.author
                                                                .metadata.name
                                                                ? feed.author
                                                                      .metadata
                                                                      .name[0]
                                                                : "U"
                                                            ).toUpperCase()}{" "}
                                                        </span>{" "}
                                                    </div>{" "}
                                                </div>
                                            )}

                                            {/* <AvatarFallback>
                                                {feed.author.metadata.name
                                                    ? feed.author.metadata
                                                          .name[0]
                                                    : "U"}
                                            </AvatarFallback> */}
                                        </Avatar>
                                    </div>
                                    <div className="space-y-2 p-2 break-all">
                                        <h3 className="text-0.75xl font-semibold">
                                            {" "}
                                            {feed.author.metadata.name}
                                        </h3>
                                        <div className="space-y-2 whitespace-pre-line">
                                            <p>{feed.note.details.content}</p>
                                        </div>
                                        <div className="space-y-2 p-4 bg-gray-100 rounded-lg">
                                            {feed.entity.metadata.covers &&
                                            feed.entity.metadata ? (
                                                <Link
                                                    href={
                                                        feed.entity.metadata.url
                                                    }
                                                    className="block"
                                                    prefetch={false}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={
                                                                feed.entity
                                                                    .metadata
                                                                    .covers
                                                                    ? feed
                                                                          .entity
                                                                          .metadata
                                                                          .covers[0]
                                                                          .address
                                                                    : "/placeholder.svg"
                                                            }
                                                            alt="Webpage Preview"
                                                            width={80}
                                                            height={80}
                                                            className="rounded-lg w-20 aspect-[1] object-cover"
                                                        />
                                                        <div>
                                                            <p
                                                                className="text-lg font-semibold invisible md:visible overflow-hidden"
                                                                style={{
                                                                    display:
                                                                        "-webkit-box",
                                                                    WebkitBoxOrient:
                                                                        "vertical",
                                                                    WebkitLineClamp:
                                                                        "1",
                                                                }}
                                                            >
                                                                {
                                                                    feed.entity
                                                                        .metadata
                                                                        .title
                                                                }
                                                            </p>
                                                            <p
                                                                className="invisible md:visible text-sm overflow-hidden text-gray-500 font-normal"
                                                                style={{
                                                                    display:
                                                                        "-webkit-box",
                                                                    WebkitBoxOrient:
                                                                        "vertical",
                                                                    WebkitLineClamp:
                                                                        "2",
                                                                }}
                                                            >
                                                                {
                                                                    feed.entity
                                                                        .metadata
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <LinkPreview
                                                    url={
                                                        feed.entity.metadata.url
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 px-6 md:px-12" />
                                <div className="flex gap-2 px-2.5 justify-end">
                                    <Link href={feed.entity.metadata.url}>
                                        <Button variant="outline">
                                            <EyeIcon className="mr-2 h-4 w-4" />
                                            Go to view
                                        </Button>
                                    </Link>
                                    {feed.note.details.external_url && (
                                        <Link
                                            href={
                                                feed.note.details.external_url
                                            }
                                        >
                                            <Button variant="outline">
                                                <MessageCircleIcon className="mr-2 h-4 w-4" />
                                                Join the discussion
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                                <div className="space-y-2 px-[55px] py-4 text-gray-500">
                                    <p className="mb-4 break-all">
                                        {(feed.note as any).replies}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="mt-12 flex items-center justify-between border-t pt-6 text-sm text-gray-500 dark:text-gray-400 text-center mx-auto">
                <p>
                    Produced with ❤️ by{" "}
                    <a
                        href="https://colib.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Colib
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://uncommons.cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Uncommons
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
}

function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function MessageCircleIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}
