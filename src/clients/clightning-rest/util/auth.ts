type MacroonEncodingtype = "utf8" | "hex" | "base64";

const clnRestHelper = ({
  macroon = process.env.CLNREST_MACAROON || "",
  macroonEncodingType = process.env.CLNREST_MACAROON_ENCODING
}: { macroon?: string; macroonEncodingType?: MacroonEncodingtype } = {}) => {
  if (!macroon || !macroonEncodingType)
    throw "Lnd transport missing macroon or macroon type";
  const customHeaders = async (): Promise<{
    macaroon: string;
    encodingtype: MacroonEncodingtype;
  }> => {
    let macroonEncoded = await makeToken(macroon, macroonEncodingType);
    let headers = {
      macaroon: macroon,
      encodingtype: macroonEncodingType
    };
    return headers;
  };
  const makeToken = async (
    macroon: string,
    encoding: MacroonEncodingtype
  ): Promise<string> => {
    switch (encoding) {
      case "utf8":
        return Buffer.from(macroon).toString("base64");
        break;
      case "base64":
        return Buffer.from(macroon, "base64").toString("hex");
      case "hex":
        return macroon;
      default:
        return macroon;
    }
  };

  return { customHeaders, makeToken };
};

export { clnRestHelper };
