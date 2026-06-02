import type { NextApiRequest, NextApiResponse } from "next";

const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";

function ipfsToGateway(url?: string) {
  if (!url) return "";

  if (Array.isArray(url)) {
    url = url.join("");
  }

  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }

  return url;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { unit } = req.body;

    if (!unit) {
      return res.status(400).json({ error: "Asset unit is required" });
    }

    const response = await fetch(`${BLOCKFROST_URL}/assets/${unit}`, {
      headers: {
        project_id: process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!,
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const asset = await response.json();

    const metadata = asset.onchain_metadata || {};

    return res.status(200).json({
      unit: asset.asset,
      policyId: asset.policy_id,
      assetName: metadata.name || asset.asset_name || "Unnamed NFT",
      image: ipfsToGateway(metadata.image),
      description: metadata.description || "",
      mediaType: metadata.mediaType || "",
      fingerprint: asset.fingerprint,
      quantity: asset.quantity,
    });
  } catch (error) {
    console.error("Get asset details error:", error);
    return res.status(500).json({ error: "Failed to get asset details" });
  }
}