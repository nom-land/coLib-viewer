import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import LinkPreview from "./linkPreview";
import { EntryInfo } from "nomland.js";

export default async function RecordCard({
    id,
    context,
    recordData,
}: {
    id: string;
    context: "community" | "app";
    recordData: EntryInfo;
}) {
    const record = recordData.metadata as any; // TODO: import Entity
    const recordType = record["record_type"] || "post";
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
