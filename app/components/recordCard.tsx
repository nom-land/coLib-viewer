import { createContract } from "crossbell";
import Link from "next/link";
import { ViewMode } from "../typings/types";
import JsonViewer from "./jsonViewer";

async function getData(id: string) {
    const c = createContract();

    const { data: rData } = await c.character.get({
        characterId: id,
    });

    return rData;
}

export default async function RecordCard({
    id,
    viewMode,
}: {
    id: string;
    viewMode: ViewMode;
}) {
    const rData = await getData(id);
    const record = {
        link: (rData.metadata as any).url,
        title: (rData.metadata as any).title,
        author: (rData.metadata as any).author,
    };

    return (
        <div className="border">
            <div> {record.title}</div>
            <div>{record.link}</div>
            <div>Author: {record.author}</div>

            {viewMode === "analyzed" && (
                <JsonViewer props={rData.metadata}></JsonViewer>
            )}
            <Link href={`./record/${id}`}>
                <div>More ↗ </div>
            </Link>
        </div>
    );
}
