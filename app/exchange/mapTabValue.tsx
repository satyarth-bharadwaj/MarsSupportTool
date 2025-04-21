export default function mapTabvalue(api: string) {
  switch (api) {
    case "Get eligibility":
      return "1";

    case "Get Freeze Period":
      return "2";

    case "Get Collection period":
      return "3";
    case "Get Estimation":
      return "4";
    case "Get Status":
      return "5";
    case "Get Campaign":
      return "6";

    default:
      throw new Error(`Unsupported API value: ${api}`);
  }
}
