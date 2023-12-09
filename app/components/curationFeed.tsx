import Link from "next/link";
import CharacterHeader from "./characterHeader";
import LinkPreview from "./linkPreview";
import NoteStatLine from "./noteStatLine";
import Tags from "./tags";
import { CurationNote, CurationStat } from "nomland.js";

// TODO: exported from nomland.js
interface Curation {
    n: CurationNote;
    record: {
        title: string;
    };
    stat: CurationStat;
}

export default function CurationFeed(props: { curationNotes: Curation[] }) {
    const { curationNotes } = props;

    return (
        <div className="list-items gap-4">
            {curationNotes.map((cur, i) => (
                <div className="card my-3" key={i}>
                    <Link key={cur.n.postId} href={`/curation/${cur.n.postId}`}>
                        <div>
                            <CharacterHeader
                                name={cur.n.curatorName}
                                handle={cur.n.curatorHandle}
                                avatar={cur.n.curatorAvatars[0]}
                                date={cur.n.dateString}
                            ></CharacterHeader>
                            <div className="my-3">
                                {/* <blockquote className="py-2 px-3 my-4 border-l-4 border-gray-300 dark:border-gray-500"> */}
                                <div className="leading-relaxed text-gray-900 whitespace-pre-line">
                                    {cur.n.content}
                                </div>
                                {/* </blockquote> */}
                            </div>

                            {(cur.n.raw.toCharacter?.metadata?.content as any)
                                .url ? (
                                <LinkPreview
                                    url={
                                        (
                                            cur.n.raw.toCharacter?.metadata
                                                ?.content as any
                                        ).url
                                    }
                                />
                            ) : (
                                <div className="flex gap-1 my-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                        />
                                    </svg>
                                    {cur.record.title}
                                </div>
                            )}
                            <Tags tags={cur.n.suggestedTags} />

                            <NoteStatLine
                                replies={cur.stat.replies || 0}
                            ></NoteStatLine>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
