/* - check if PDF
*  - check for iframes
*  - generate QR code for iframe link
*  - replace node
*  QR codes will be saved in the image_folder. make sure this folder exists!
*/


// see (https://next.jupyterbook.org/plugins/directives-and-roles#create-a-transform)

// npm install qrcode

import QRCode from "qrcode-generator";
import { writeFile } from "fs/promises";

const image_folder = "./images";

const iframeTransform = {
  name: "iframe-pdf",
  doc: "Replace iframes in PDF builds with QR codes.",
  stage: "document",
  plugin: (opts, utils) => async (tree) => {
    
    // Detect if we are building a PDF by checking for pdf or typst in the command line arguments
    const isPDF = process.argv.some(arg => arg.includes("pdf") || arg.includes("typst"));

    // Get all nodes for each page
    const rootChildren = tree.children[0]?.children || [];

    if (isPDF) {
        for (const [index, node] of rootChildren.entries()) {
            if (node.type === "container" && node.children[0]?.type === "iframe") {
                const url = node.children[0]?.src || "No link found";

                // Let image name be last part of the URL
                const urlParts = url.split('/');
                const lastPart = urlParts[urlParts.length - 1];

                try {
                    node.qr_index = lastPart.replace(/[^a-zA-Z0-9]/g, '_'); // sanitize for filename

                    // Generate QR code (SVG format)
                    const qr = QRCode(0, 'L'); // 0 = auto version, 'L' = error correction level
                    qr.addData(url);
                    qr.make();

                    const svg = qr.createSvgTag({ cellSize: 4, margin: 2 });

                    // Save SVG to file
                    const outputFile = `${image_folder}/qrcode_${node.qr_index}.svg`;
                    await writeFile(outputFile, svg, "utf8");

                    console.log(`[IFRAME] Generated QR code, saved to ${outputFile}`);

                    // Make a figure out of it
                    node.type = "container";
                    node.kind = "figure";
                    node.children = [
                        {
                            type: "image",
                            url: `../images/qrcode_${node.qr_index}.svg`, // updated to .svg
                            alt: "QR code",
                            title: "scan the QR code to open the link",
                            width: "200px",
                            align: "center"
                        },
                        {
                            type: "caption",
                            children: [
                                {
                                    type: "paragraph",
                                    children: [
                                        { type: "text", value: "scan the QR code to open the link or click " },
                                        { type: "link", url: url, children: [{ type: "text", value: "here" }] },
                                        { type: "text", value: " to open the link." }
                                    ]
                                }
                            ]
                        }
                    ];
                } catch (err) {
                    console.log("[IFRAME] Error generating QR code:", err);
                }
            }
        }
    }
  },
};

const plugin = {
  name: "Iframe PDF Plugin",
  transforms: [iframeTransform],
};

export default plugin;