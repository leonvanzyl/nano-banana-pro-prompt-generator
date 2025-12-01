New with Gemini 3 Pro Image
Gemini 3 Pro Image (gemini-3-pro-image-preview) is a state-of-the-art image generation and editing model optimized for professional asset production. Designed to tackle the most challenging workflows through advanced reasoning, it excels at complex, multi-turn creation and modification tasks.

High-resolution output: Built-in generation capabilities for 1K, 2K, and 4K visuals.
Advanced text rendering: Capable of generating legible, stylized text for infographics, menus, diagrams, and marketing assets.
Grounding with Google Search: The model can use Google Search as a tool to verify facts and generate imagery based on real-time data (e.g., current weather maps, stock charts, recent events).
Thinking mode: The model utilizes a "thinking" process to reason through complex prompts. It generates interim "thought images" (visible in the backend but not charged) to refine the composition before producing the final high-quality output.
Up to 14 reference images: You can now mix up to 14 reference images to produce the final image.
Use up to 14 reference images
Gemini 3 Pro Preview lets you to mix up to 14 reference images. These 14 images can include the following:

Up to 6 images of objects with high-fidelity to include in the final image
Up to 5 images of humans to maintain character consistency

Python
Javascript
Go
Java
REST

import { GoogleGenAI } from "@google/genai";
import \* as fs from "node:fs";

async function main() {

const ai = new GoogleGenAI({});

const prompt =
'An office group photo of these people, they are making funny faces.';
const aspectRatio = '5:4';
const resolution = '2K';

const contents = [
{ text: prompt },
{
inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile1,
},
},
{
inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile2,
},
},
{
inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile3,
},
},
{
inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile4,
},
},
{
inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile5,
},
}
];

const response = await ai.models.generateContent({
model: 'gemini-3-pro-image-preview',
contents: contents,
config: {
responseModalities: ['TEXT', 'IMAGE'],
imageConfig: {
aspectRatio: aspectRatio,
imageSize: resolution,
},
},
});

for (const part of response.candidates[0].content.parts) {
if (part.text) {
console.log(part.text);
} else if (part.inlineData) {
const imageData = part.inlineData.data;
const buffer = Buffer.from(imageData, "base64");
fs.writeFileSync("image.png", buffer);
console.log("Image saved as image.png");
}
}

}

main();
