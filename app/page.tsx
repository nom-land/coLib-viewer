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
        <iframe
            src="https://colib-where-communities-meet.framer.ai/"
            className="w-full h-screen"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
