import JsonViewer from "@/app/components/jsonViewer";
import { getCharIdString } from "@/app/utils";
import { createContract } from "crossbell";
import Link from "next/link";

async function getData(communityId: string) {
    const c = createContract();

    const { data: cData } = await c.character.get({
        characterId: communityId,
    });

    //TODO: we have only "general" at the current time
    const { data: lData } = await c.link.getLinkingCharacters({
        fromCharacterId: communityId,
        linkType: "coLib-general", // TODO: change coLib to a config var
    });

    const { data: mData } = await c.link.getLinkingCharacters({
        fromCharacterId: communityId,
        linkType: "coLib-members",
    });

    return { cData, lData, mData };
}

export default async function CommunityDisplay({
    props,
}: {
    props: {
        id: string;
        viewMode: "normal" | "analyzed";
    };
}) {
    const {
        cData: communityChar,
        mData: members,
        lData: generalList,
    } = await getData(props.id);

    return (
        //TODO: if this is not a community character...
        <div>
            {props.viewMode === "normal" && (
                <div>
                    <section>
                        Welcome to {communityChar.metadata?.name}(
                        {getCharIdString(communityChar)})
                    </section>
                    <section>
                        <div> Community members </div>
                        {members.map((member) => (
                            <div key={member.handle}>
                                {member.metadata?.name}(
                                {getCharIdString(member)})
                            </div>
                        ))}
                    </section>
                    <section>
                        Curated Content
                        {generalList.map((record) => (
                            <>
                                <div
                                    className="border p-5 my-5"
                                    key={record.characterId.toString()}
                                >
                                    <div>
                                        {(record.metadata as any)["title"]}
                                    </div>
                                    <div>
                                        {
                                            (record.metadata as any)[
                                                "description"
                                            ]
                                        }
                                    </div>

                                    <a href={(record.metadata as any)["url"]}>
                                        {(record.metadata as any)["url"]}
                                    </a>
                                    <Link
                                        href={`./community/${
                                            props.id
                                        }/record/${record.characterId.toString()}`}
                                    >
                                        <div> ↗ </div>
                                    </Link>
                                </div>
                            </>
                        ))}
                    </section>
                </div>
            )}
            {props.viewMode === "analyzed" && (
                <div>
                    <section>
                        <div className="text-sm italic">
                            <span>
                                Each list is essentially a linklist emitted from
                                the community character.{" "}
                            </span>
                            <br></br>
                            <span>
                                Each record is essentially a character on
                                Crossbell.
                            </span>
                        </div>
                    </section>

                    <hr></hr>
                    <section>
                        <div> Community character </div>
                        <div className="border">
                            <div>
                                id: {communityChar.characterId.toString()}
                            </div>
                            <div>handle: {communityChar.handle}</div>
                            <div>
                                metadata:{" "}
                                <JsonViewer
                                    props={communityChar.metadata || {}}
                                ></JsonViewer>{" "}
                            </div>
                        </div>
                    </section>

                    <hr></hr>
                    <section>
                        <div> Community members(count: {members.length}) </div>
                        {members.map((member) => (
                            <div
                                className="border"
                                key={member.characterId.toString()}
                            >
                                <div>id: {member.characterId.toString()}</div>
                                <div>handle: {member.handle}</div>
                                <div>
                                    metadata:{" "}
                                    <JsonViewer
                                        props={member.metadata || {}}
                                    ></JsonViewer>{" "}
                                </div>
                            </div>
                        ))}
                    </section>
                    <hr></hr>

                    <section>
                        <div>General(count: {generalList.length})</div>
                        {generalList.map((record) => (
                            <>
                                <div
                                    className="border p-5 my-5"
                                    key={record.characterId.toString()}
                                >
                                    <div>
                                        id: {record.characterId.toString()}{" "}
                                    </div>
                                    <div>handle: {record.handle} </div>
                                    <div>
                                        metadata:{" "}
                                        <JsonViewer
                                            props={record.metadata || {}}
                                        ></JsonViewer>{" "}
                                    </div>
                                    <Link
                                        href={`./community/${
                                            props.id
                                        }/record/${record.characterId.toString()}`}
                                    >
                                        <div>➡️details</div>
                                    </Link>
                                </div>
                            </>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
}
