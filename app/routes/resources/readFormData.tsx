export async function parseCouponFormData(request: Request): Promise<any> {
  const formbody = await request.formData();
  const api = formbody.get("api");
  const credentials = formbody.get("credentials");

  let input;
  let isValidCouponInput: boolean = false;
  let isValidCustomerInput: boolean = false;
  const CouponandPromotionregex =
    /^(?:(?:\d{22})|(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})|(?:[A-Z0-9]{12}))(?:,\s*(?:(?:\d{22})|(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})|(?:[A-Z0-9]{12})))*$/;
  const Customerregex =
    /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  if (api === "Promotion" || api === "Coupon By Ids") {
    input = formbody.get("couponID");
    if (typeof input === "string" && CouponandPromotionregex.test(input)) {
      isValidCouponInput = true;
    }
  } else {
    input = formbody.get("customerID");
    if (typeof input === "string" && Customerregex.test(input)) {
      isValidCustomerInput = true;
    }
  }
  return { input, credentials, api, isValidCouponInput, isValidCustomerInput };
}

export async function parseFormData(request: Request): Promise<any> {
  const formbody = await request.formData();
  const customerId = formbody.get("customerID");
  const schemeId = formbody.get("SchemeId");
  const credentials = formbody.get("credentials");
  const api = formbody.get("api");
  const Customerregex =
    /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  let isValidCustomerInput: boolean = false;
  if (typeof customerId === "string" && Customerregex.test(customerId)) {
    isValidCustomerInput = true;
  }
  return { customerId, schemeId, credentials, api, isValidCustomerInput };
}
export async function parseExchangeFormData(request: Request): Promise<any> {
  const formbody = await request.formData();
  const customerId = formbody.get("customerID");
  const schemeId = formbody.get("SchemeId");
  const credentials = formbody.get("credentials");
  const clubcard = formbody.get("clubcard");
  const api = formbody.get("api");
  const Customerregex =
    /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  let isValidCustomerInput: boolean = false;
  if (typeof customerId === "string" && Customerregex.test(customerId)) {
    isValidCustomerInput = true;
  }
  return {
    customerId,
    schemeId,
    credentials,
    clubcard,
    api,
    isValidCustomerInput: true,
  };
}
