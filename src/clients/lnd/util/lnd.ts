type MacroonEncodingtype= 'utf8' | 'hex' | 'base64';

const lndHelper = ({
    macroon = process.env.LND_MACROON || '',
    macroonEncodingType = 'utf8'
}:{macroon?:string;macroonEncodingType?: MacroonEncodingtype}={})=> {
    const customHeaders = async ():Promise<{'Grpc-Metadata-Macaroon': string;}> => {
        let macroonEncoded = await makeToken(macroon,macroonEncodingType)
        let headers = {
          'Grpc-Metadata-Macaroon': macroonEncoded,
        };
        return headers;
    };
    const makeToken = async (
        macroon: string,
        encoding: MacroonEncodingtype,
    ): Promise<string> => {
        switch(encoding){
            case "utf8":
                return Buffer.from(macroon).toString("base64")
                break;
            case "base64":
                return Buffer.from(macroon,"base64").toString("hex")
            case "hex":
                return macroon;
            default:return macroon;
        }
    };

    return {customHeaders, makeToken}
};

export {lndHelper}
