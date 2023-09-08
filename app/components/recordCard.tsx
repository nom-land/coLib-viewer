import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getCharacterData } from "../apis";
import { shortenUrl } from "../utils";

interface ArticleData {
    url?: string;
    links?: string[];
    title?: string;
    description?: string;
    image?: string;
    author?: string;
    content?: string;
    source?: string;
    published?: string;
    ttr?: number;
}

interface ExtendedArticleData extends ArticleData {
    authors: string[];
    language: string;
    copyright: string;
    derivation: "original" | "translation" | "unknown";
    upstream?: string; // if this is translation, then upstrem is the original record
}

export default async function RecordCard({
    id,
    context,
}: {
    id: string;
    context: "community" | "app";
}) {
    const rData = await getCharacterData(id);
    const record = { ...(rData.metadata as ExtendedArticleData) };
    const recordType = (record as any)["record_type"] as string;

    return (
        <div className="w-content md:w-[36rem] card p-5 card my-5 mx-3">
            <div className="text-lg font-bold"> {record.title}</div>
            <div className="flex items-center gap-1">
                <svg
                    className="h-4 w-4 text-black"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />{" "}
                    <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
                </svg>
                {record.url && (
                    <Link href={record.url} title={record.url}>
                        {shortenUrl(record.url)}
                    </Link>
                )}
            </div>

            <div>
                <span className="font-extralight text-sm">Record Type:</span>{" "}
                {recordType}
            </div>
            <div>
                <span className="font-extralight text-sm">Author:</span>{" "}
                {record.author || "unknown"}
            </div>
            <div>
                <span className="font-extralight text-sm">Language:</span>{" "}
                {record.language || "unknown"}
            </div>
            <div>
                <span className="font-extralight text-sm">Copyright:</span> :{" "}
                {record.copyright || "unknown"}
            </div>
            <div>
                <span className="font-extralight text-sm">Original:</span> :{" "}
                {record.derivation || "unknown"}
            </div>

            {record.description && (
                <ReactMarkdown>{record.description}</ReactMarkdown>
            )}

            {context === "community" && (
                <div className="font-light text-sm mt-4">
                    <Link href={`./record/${id}`}>
                        <div>
                            See what other communities are talking about this{" "}
                            {recordType}↗{" "}
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
