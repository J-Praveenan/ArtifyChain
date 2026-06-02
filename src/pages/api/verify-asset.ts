import type { NextApiRequest, NextApiResponse } from "next";

const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";

function ipfsToGateway(image?: string | string[]) {
  if (!image) return "";

  let imageUrl = Array.isArray(image) ? image.join("") : image;

  if (imageUrl.startsWith("ipfs://")) {
    imageUrl = imageUrl.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    );
  }

  return imageUrl;
}

function hexToText(hex: string) {
  try {
    return Buffer.from(hex, "hex").toString("utf8");
  } catch {
    return hex;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { txHash } = req.body;

    if (!txHash) {
      return res.status(400).json({
        error: "Transaction hash is required",
      });
    }

    const headers = {
      project_id: process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!,
    };

    const txResponse = await fetch(`${BLOCKFROST_URL}/txs/${txHash}`, {
      headers,
    });

    if (!txResponse.ok) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    const txData = await txResponse.json();

    const utxoResponse = await fetch(`${BLOCKFROST_URL}/txs/${txHash}/utxos`, {
      headers,
    });

    const utxoData = await utxoResponse.json();

    const metadataResponse = await fetch(
      `${BLOCKFROST_URL}/txs/${txHash}/metadata`,
      { headers }
    );

    const metadataData = metadataResponse.ok
      ? await metadataResponse.json()
      : [];

    const mintedAssets =
      utxoData.outputs
        ?.flatMap((output: any) =>
          output.amount
            .filter((item: any) => item.unit !== "lovelace")
            .map((item: any) => ({
              unit: item.unit,
              quantity: item.quantity,
              ownerAddress: output.address,
              policyId: item.unit.slice(0, 56),
              assetNameHex: item.unit.slice(56),
              assetName: hexToText(item.unit.slice(56)),
            }))
        ) || [];

    const assetsWithMetadata = await Promise.all(
      mintedAssets.map(async (asset: any) => {
        const assetResponse = await fetch(
          `${BLOCKFROST_URL}/assets/${asset.unit}`,
          { headers }
        );

        if (!assetResponse.ok) {
          return {
            ...asset,
            image: "",
            description: "",
          };
        }

        const assetDetails = await assetResponse.json();
        const onchainMetadata = assetDetails.onchain_metadata || {};

        return {
          ...asset,
          fingerprint: assetDetails.fingerprint,
          image: ipfsToGateway(onchainMetadata.image),
          name: onchainMetadata.name || asset.assetName,
          description: onchainMetadata.description || "",
          mediaType: onchainMetadata.mediaType || "",
        };
      })
    );

    return res.status(200).json({
      tx: txData,
      metadata: metadataData,
      assets: assetsWithMetadata,
    });
  } catch (error) {
    console.error("Verify transaction error:", error);

    return res.status(500).json({
      error: "Failed to verify transaction",
    });
  }
}