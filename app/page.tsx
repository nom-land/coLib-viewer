import { crossbell } from "crossbell/network";
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
        <div className="container mx-auto py-10 px-10 lg:px-40 min-h-screen">
            <div> This is preview page. </div>
            <div className="my-10">Welcome to {homeName}!</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {communityIds.map((id) => (
                    <Link className="card" key={id} href={`./community/${id}`}>
                        {id}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
