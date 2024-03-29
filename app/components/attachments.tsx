import { NoteMetadataAttachmentBase } from "crossbell";
import { NoteInfo } from "nomland.js";
import Image from "next/image";

export default function Attachments(props: { note: NoteInfo }) {
    const { note } = props;
    return (
        <div>
            {note.details.attachments?.map(
                (
                    a: NoteMetadataAttachmentBase<"address" | "content">,
                    i: number
                ) =>
                    a.address && (
                        <div key={i} className="my-3">
                            <Image
                                priority
                                src={
                                    a.address?.startsWith("ipfs://")
                                        ? `https://ipfs.crossbell.io/ipfs/${a.address.slice(
                                              7
                                          )}`
                                        : a.address
                                }
                                width={200}
                                height={200}
                                alt="attachment"
                            ></Image>
                        </div>
                    )
            )}
        </div>
    );
}
