import type { NextApiRequest, NextApiResponse } from "next";

const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageUrl, name, prompt } = req.body;

    if (!imageUrl || !name) {
      return res.status(400).json({ error: "Image URL and name are required" });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append("file", imageBlob, `${name}.png`);

    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name,
        keyvalues: {
          prompt,
          app: "ArtifyChain",
        },
      })
    );

    const uploadResponse = await fetch(PINATA_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return res.status(500).json({ error: data.error || "IPFS upload failed" });
    }

    return res.status(200).json({
      cid: data.IpfsHash,
      ipfsUrl: `ipfs://${data.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    });
  } catch (error) {
    console.error("IPFS upload error:", error);
    return res.status(500).json({ error: "IPFS upload failed" });
  }
}