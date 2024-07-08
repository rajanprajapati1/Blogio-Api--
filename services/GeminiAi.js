import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function GeminiAiService(prompt, taskType) {
  let data = "";
  switch (taskType) {
    case "title":
      data = `Generate a title under 50 words for my blog on ${prompt}. Please provide only one title.It Should be SEO Friendly .and Dont add any symbol special Character in the Title`;
      break;
    case "subtitle":
      data = `Generate a subtitle under 50 words for my blog on ${prompt}. Please provide only one subtitle.It Should be SEO Friendly .and Dont add any symbol special Character in the SubTitle`;
      break;
    case "content":
      data = `Generate blog content on ${prompt} in HTML format suitable for rendering in a Jodit editor. Ensure the content is cool and stylish and Inline style, and please exclude any instructions or additional text.`;
      break;
    case "tags":
      data = `Generate a list of tags related to ${prompt}. Provide them in a comma-separated format.`;
      break;
    default:
      data = `Generate a cool and trending blog topic that is currently popular and engaging.`;
      break;
  }

  const result = await model.generateContent(data);
  const response = await result.response;
  const text = response.text();
  return text;
}

export default GeminiAiService;
