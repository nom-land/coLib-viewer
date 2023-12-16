import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { getCharacterData } from "../apis";
import LinkPreview from "./linkPreview";

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
        <div className="w-content md:w-[36rem] card p-5 mx-3 my-5">
            {record.url && <LinkPreview url={record.url} />}
            <div className="text-lg font-bold"> {record.title}</div>
            <div className="flex items-center gap-1 truncate">
                {record.url && (
                    <Link href={record.url} title={record.url}>
                        🔗 {record.url}
                    </Link>
                )}
            </div>

            <div>
                <span className="font-extralight text-sm">Record Type:</span>{" "}
                {recordType}
            </div>
            {(record.author ||
                record.authors?.join(", ") ||
                (record as any).metaData?.authors) && (
                <div>
                    <span className="font-extralight text-sm">Author:</span>{" "}
                    {record.author ||
                        record.authors?.join(", ") ||
                        (record as any).metaData?.authors?.join(", ")}
                </div>
            )}
            {record.language && record.language !== "unknown" && (
                <div>
                    <span className="font-extralight text-sm">Language:</span>{" "}
                    {record.language}
                </div>
            )}
            {/* <div>
                <span className="font-extralight text-sm">Copyright:</span> :{" "}
                {record.copyright || "unknown"}
            </div> */}
            {/* <div>
                <span className="font-extralight text-sm">Original:</span> :{" "}
                {record.derivation || "unknown"}
            </div> */}

            {record.description && (
                <ReactMarkdown>
                    {record.description.slice(0, 160) +
                        (record.description.length > 160 ? "..." : "")}
                </ReactMarkdown>
            )}

            {context === "community" && (
                <div className="font-light text-sm mt-4">
                    <Link href={`/record/${id}`}>
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
