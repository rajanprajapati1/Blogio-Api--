const URL = process.env.LEXICA_API_URL;
async function LexicaAiService(payload) {
  try {
    const res = await fetch(`${URL}/?q=${payload?.query}`, {
      method: "GET",
    });
    const data = await res.json();
    const filterdata = await data?.images?.filter((val,i)=>val?.guidance >= 8)
    return filterdata;
  } catch (error) {
    return { error: error?.message };
  }
}

export default LexicaAiService;
