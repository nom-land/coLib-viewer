import ReactMarkdown from "react-markdown";
import { getCharacterData } from "../apis";
import { shortenUrl } from "../utils";

export default async function SimpleRecordCard({
    recordId,
}: {
    recordId: string;
}) {
    const record = await getCharacterData(recordId);

    return (
        <div className="card border p-5 my-5">
            <div className="text-xl font-bold my-3">
                {(record.metadata as any)["title"] ||
                    shortenUrl((record.metadata as any)["url"], 36)}
            </div>
            <ReactMarkdown>
                {(record.metadata as any)["description"]}
            </ReactMarkdown>
        </div>
    );
}
