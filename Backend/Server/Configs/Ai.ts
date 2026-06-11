import OpenAI from "openai";

const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY as string,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export default nvidiaClient;
