export default function mapTabvalue(api: string) {
  switch (api) {
    case "Get Balances":
      return "1";
    case "Get Statement":
      return "2";
    case "Get Statement preference":
      return "3";
    case "Get Group":
      return "5";
    case "Get Group Profile":
      return "6";
    case "Get Schemes":
      return "4";
    case "Get Account Profile":
      return "7";
    case "Get Account TXN_Doc":
      return "8";
    default:
      throw new Error(`Unsupported API value: ${api}`);
  }
}
