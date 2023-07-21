import Image from "next/image";
import { crossbell } from "crossbell/network";
import { createContract } from "crossbell";
import Link from "next/link";
import { homeName } from "./config";

// Only the selected communities will be displayed
const communityIds = ["57198"]; //TODO

//Localhost
if (process.env.CROSSBELL_RPC_ADDRESS === "http://127.0.0.1:8545") {
    (crossbell.id as any) = 31337;
}
//Localhost End

export default async function Home() {
    return (
        <div className="container mx-auto py-10 px-40">
            <div className="my-10">Welcome to {homeName}!</div>
            <div className="grid grid-cols-4 gap-4">
                {communityIds.map((id) => (
                    <Link className="card" key={id} href={`./community/${id}`}>
                        {id}
                    </Link>
                ))}
            </div>
        </div>
    );
}
