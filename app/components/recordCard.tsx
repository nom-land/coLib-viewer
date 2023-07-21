import { createContract } from "crossbell";
import Link from "next/link";
import { ViewMode } from "../typings/types";
import JsonViewer from "./jsonViewer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { appName } from "../config";

async function getData(id: string) {
    const c = createContract();

    const { data: rData } = await c.character.get({
        characterId: id,
    });

    return rData;
}
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
    viewMode,
    context,
}: {
    id: string;
    viewMode: ViewMode;
    context: "community" | "app";
}) {
    const rData = await getData(id);
    const record = { ...(rData.metadata as ExtendedArticleData) };
    const recordType = (record as any)["record_type"] as string;

    return (
        //sm:w-full
        <div className=" w-[36rem] card p-5 card p-5 ">
            <div className="text-lg font-bold"> {record.title}</div>
            {record.url && <Link href={record.url}>{record.url}</Link>}
            <div>Record Type: {recordType}</div>
            <div>Author: {record.author || "unknown"}</div>
            <div>Language: {record.language || "unknown"}</div>
            <div>Copyright: {record.copyright || "unknown"}</div>
            <div>Original: {record.derivation || "unknown"}</div>

            {viewMode === "analyzed" && (
                <JsonViewer props={rData.metadata || {}}></JsonViewer>
            )}
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
