import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      process.env.NEXT_PUBLIC_CF_WORKER_URL!,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Cloudflare AI failed");
    }

    const arrayBuffer = await response.arrayBuffer();

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const imageUrl = `data:image/png;base64,${base64}`;

    return res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to generate image",
    });
  }
}