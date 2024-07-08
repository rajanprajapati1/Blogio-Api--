import GeminiAiService from "../services/GeminiAi.js";
import LexicaAiService from "../services/LexicaAi.js";

class PromptController {
  static async GenerateText(req, res) {
    try {
      const { prompt, taskType } = req.body;
      console.log(prompt, taskType);
      const AuthUser = req.user;
      if (!AuthUser) {
        return res.status(403).json({
          msg: "Access denied. You are not authorized to edit this user detail.",
          status: 403,
        });
      }
      const genratedText = await GeminiAiService(prompt, taskType);
      return res.status(200).json({
        msg: "success",
        status: 200,
        data: genratedText,
      });
    } catch (error) {
      return res.status(404).json({
        msg: "Something Went Wrong While Genrating Text",
        status: 404,
        error,
      });
    }
  }
  static async GenerateImage(req, res) {
    try {
      const { id } = req.params;
      // const AuthUser = req.user;
      // if (!AuthUser) {
      //   return res.status(403).json({
      //     msg: "Access denied. You are not authorized .",
      //     status: 403,
      //   });
      // }
      const fetchImages = await LexicaAiService({ query: id });
      return res.status(200).json({
        msg: "success",
        status: 200,
        data: fetchImages,
      });
    } catch (error) {
      return res.status(404).json({
        msg: "Something Went Wrong While Genrating Image",
        status: 404,
        error,
      });
    }
  }
}

export default PromptController;
