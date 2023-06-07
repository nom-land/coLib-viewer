import Image from "next/image";
import { crossbell } from "crossbell/network";
import { createContract } from "crossbell";
import Link from "next/link";

const communityId = ["56142", "56217"]; //TODO

//Localhost
if (process.env.CROSSBELL_RPC_ADDRESS === "http://127.0.0.1:8545") {
    (crossbell.id as any) = 31337;
}
//Localhost End

export default async function Home() {
    return (
        <div className="container mx-auto py-10">
            <div>Welcome to Community Lib!</div>
            <div>Selected communities:</div>
            {communityId.map((id) => (
                <div key={id}>
                    <Link href={`./community/${id}`}>{id}</Link>
                </div>
            ))}
        </div>
    );
}
