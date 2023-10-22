import { NextRequest, NextResponse } from "next/server";

import { unfurl } from "unfurl.js";

type SuccessResponse = {
    title: string;
    description: string | null;
    favicon: string | null;
    imageSrc: string | null;
};

const CACHE_RESULT_SECONDS = 60 * 60 * 24; // 1 day
export const revalidate = 60 * 60 * 24; // 1 day

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url || typeof url !== "string") {
        return NextResponse.json(
            // TODO: update typescript version
            { error: "A valid URL string is required" },
            {
                status: 400,
            }
        );
    }

    return unfurl(url)
        .then((unfurlResponse) => {
            const response: SuccessResponse = {
                title: unfurlResponse.title ?? "",
                description: unfurlResponse.description ?? null,
                favicon: unfurlResponse.favicon ?? null,
                imageSrc: unfurlResponse.open_graph?.images?.[0]?.url ?? null,
            };
            return NextResponse.json(response, {
                headers: {
                    "Cache-Control": `public, max-age=${CACHE_RESULT_SECONDS}`,
                },
            });
        })
        .catch((error) => {
            if (error?.code === "ENOTFOUND") {
                return NextResponse.json(
                    { error: "Not found" },
                    { status: 404 }
                );
            }
            console.error(error);
            throw new Error(error);
        });
}

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const url = searchParams.get("url");
//         if (!url || typeof url !== "string") {
//             return Response.json(
//                 { error: "A valid URL string is required" },
//                 {
//                     status: 400,
//                 }
//             );
//         }

//         let image = await getImageBase64(url);

//         Response.json({
//             image,
//         });
//     } catch (error) {
//         Response.json(
//             {
//                 error: JSON.stringify(error),
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }

// let getImageBase64 = async (url: string) => {
//     let browser = await puppeteer.launch({ headless: true });
//     let page = await browser.newPage();
//     await page.goto(url);
//     let image = await page.screenshot({ encoding: "base64" });
//     await browser.close();
//     return image;
// };
