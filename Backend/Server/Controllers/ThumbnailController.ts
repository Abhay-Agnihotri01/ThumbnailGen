import { Request,Response } from "express";
import Thumbnail from "../models/Thumbnail.js";

import {v2 as cloudinary} from "cloudinary";

const stylePrompts={
    'Bold & Graphic':'eye-catching thumbnail,bold typography, vibrant colors, expressive facial reaction,dramatic lighting,high contrast, click-worthy composition,professional style',
    'Tech/Futuristic':'futuristic thumbnail,sleek modern design,digital UI elements, glowing adccents,holographic effects,cyber-tech aesthetic,sharp lighting,high-tech atmosphere',
    'Minimalist':'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space,modern flat design, clear focal point',
    'Photorealistic':'photorealistic thumbnail,ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism,shallow depth of field, ',
    'Illustrated':'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
}

const colorSchemeDescriptions={
    vibrant:"vibrant and energetic colors,high saturation,bold contrasts, eye-catching palette",
    sunset:"warm sunset tones,orange pink and purple hues,soft gradients,cinematic glow",
    forest:"natural green tones,earthy colors,calm and organic palette,fresh atmoshphere",
    neon:"neon glow effects,electric blues and pinks,cyberpunk lighting,high contrast glow",
    purple:'puple-dominant color palette,magenta and violet tones, modern and stylish mood',
    monochrome:'black and white color scheme,high contrast, dramatic lighting,timeless aesthetic',
    ocean:'cool blue and teal tones,aquatic color palette,fresh and clean atmosphere',
    pastel:'soft pastel colors,low saturation ,gentle tones,calm and friendly aesthetic',
}

const dimensionMap: Record<string, { width: number, height: number }> = {
    "16:9": { width: 1344, height: 768 },
    "9:16": { width: 768, height: 1344 },
    "1:1":  { width: 1024, height: 1024 },
};
export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const {
            title,
            prompt:user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay
        }=req.body;

        const thumbnail=await Thumbnail.create({
            userId,
            title,
            prompt_used:user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating:true

        })
    


       let prompt=`Create a ${stylePrompts[style as keyof typeof stylePrompts]} for: "${title}" `;
        
       if(color_scheme){
        prompt +=`Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]}`
       }

       if(user_prompt){
        prompt += `Additional details: ${user_prompt}`;
       }

       prompt +=`. The thumbnail should be ${aspect_ratio},visually stunning,and designed to maximize click through rate. Make it bold,professional,and impossible to ignore.`;

       //Generate the image using the ai model
       const dimensions = dimensionMap[aspect_ratio as keyof typeof dimensionMap] || { width: 1024, height: 1024 };
       const apiKey = process.env.NVIDIA_API_KEY;
       let apiResponse: any = undefined;
       let attempts = 3;
       for (let i = 0; i < attempts; i++) {
           try {
               apiResponse = await fetch("https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev", {
                   method: "POST",
                   headers: {
                       "Authorization": `Bearer ${apiKey}`,
                       "Content-Type": "application/json",
                       "Accept": "application/json"
                   },
                   body: JSON.stringify({
                       prompt,
                       width: dimensions.width,
                       height: dimensions.height
                   })
               });
               if (apiResponse.ok) break;
               console.log(`NVIDIA API attempt ${i + 1} failed with status ${apiResponse.status}. Retrying...`);
           } catch (err) {
               console.log(`NVIDIA API attempt ${i + 1} threw error: ${err}. Retrying...`);
           }
           if (i < attempts - 1) {
               await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds before retry
           }
       }

       if (!apiResponse || !apiResponse.ok) {
           const errText = apiResponse ? await apiResponse.text() : "Connection failed";
           throw new Error(`NVIDIA API Error (${apiResponse ? apiResponse.status : 'unknown'}): ${errText}`);
       }

       const responseData = await apiResponse.json() as any;
       if (!responseData.artifacts || responseData.artifacts.length === 0 || !responseData.artifacts[0].base64) {
           throw new Error("No image data returned from AI model");
       }

       const mediaType = responseData.artifacts[0].mediaType || "image/jpeg";
       const base64DataUri = `data:${mediaType};base64,${responseData.artifacts[0].base64}`;

       const uploadResult = await cloudinary.uploader.upload(base64DataUri, {
           resource_type: "image",
           folder: "thumbnails",
       });

        thumbnail.image_url = uploadResult.url;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({ message: "Thumbnail generated successfully", thumbnail });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;
        await Thumbnail.findOneAndDelete({ _id: id, userId });
        res.json({ message: "Thumbnail deleted successfully" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};