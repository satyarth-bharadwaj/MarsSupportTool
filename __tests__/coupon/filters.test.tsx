import filteringLogic from "~/coupon/filters";

describe('filteringLogic function', () => {
  it('should handle case 2 correctly', () => {
    // Mock input data
    const testData = {
      "found": [
        {
          "promotionId": "1",
          "redemptionsLeft": 0,
          "validFrom": "",
          "expiresOn": "",
          "state": "",
          "scheme": "",
          "promotionDetails": {
            "type": "voucher",
            "description": "",
            "value": "6.00",
            "currency": "GBP",
            "country": "UK",
            "scannableCode": "",
            "subType": "Christmas"
          },
          "couponId": "",
          "keyInCode": "",
          "scannableCode": "",
          "issuedToCustomerId": "",
          "maxRedemptionsLimit": 1
        }
      ],
      "notFound": []
    };

    // Mock selected filters
    const selectedFilters = ['maxRedemptionsLimit'];

    // Call the filteringLogic function
    const result = filteringLogic('2', testData, selectedFilters, [
      'couponId',
      'keyInCode',
      'scannableCode',
      'promotionId',
      'promotionDetails',
      'redemptionsLeft',
      'validFrom',
      'expiresOn',
      'state',
      'scheme',
      'issuedToCustomerId',
      'maxRedemptionsLimit',
    ]);

    // Expected result after filtering
    const expectedResult = JSON.stringify({
      "found": [
        {
          "maxRedemptionsLimit": 1
        }
      ],
      "notFound": []
    }, null, 2);

    // Assert the result
    expect(result).toEqual(expectedResult);
  });
});

describe('filteringLogic function', () => {
  

  it('should handle case 1 correctly', () => {
    const testData = {
        
      "promotionId": "",
      "redemptionsLeft": 0,
      "validFrom": "2023-10-30T00:00:00.000000Z",
      "expiresOn": "2024-01-30T23:59:59.000000Z",
      "state": "redeemed",
      "scheme": "Default",
      "promotionDetails": {
        "type": "voucher",
        "description": "Nov 2023 mailing",
        "value": "6.00",
        "currency": "GBP",
        "country": "UK",
        "scannableCode": "",
        "subType": "Christmas"
      },
      "couponId": "",
      "keyInCode": "",
      "scannableCode": "",
      "issuedToCustomerId": "",
      "maxRedemptionsLimit": 1
    
      };
    const selectedFilters = ['keyInCode','maxRedemptionsLimit'];
    const result = filteringLogic('1', testData, selectedFilters, Object.keys(testData));
    const expectedResult = JSON.stringify({ "keyInCode": "" ,"maxRedemptionsLimit": 1 }, null, 2);
    expect(result).toEqual(expectedResult);
  });


  it('should handle case 3 correctly', () => {
    // Mock input data
    const testData = [{
      "promotionId": "4b497931-f8d3-487e-bcd4-231beb48b730",
      "redemptionsLeft": 0,
      "validFrom": "2022-09-08T23:00:00.000000Z",
      "expiresOn": "2025-12-31T23:59:59.000000Z",
      "state": "redeemed",
      "scheme": "Default",
      "promotionDetails": {
        "type": "coupon",
        "description": "1Pence OFF WHEN SPEND £1",
        "scannableCode": "9917695010010"
      },
      "couponId": "471ad065-68be-48d1-9a53-2e83ab5de66b",
      "scannableCode": "9917695010010518732208",
      "issuedToCustomerId": "trn:tesco:uid:uuid:f23d85cd-24ce-4bdb-bced-ebd568391969",
      "maxRedemptionsLimit": 1
    }];

    // Mock selected filters
    const selectedFilters = ['couponId', 'state'];

    // Call the filteringLogic function
    const result = filteringLogic('3', testData, selectedFilters, Object.keys(testData[0]));

    // Expected result after filtering and mapping
    const expectedResult = JSON.stringify([
      {
        "state": "redeemed",
        "couponId": "471ad065-68be-48d1-9a53-2e83ab5de66b"
      }
    ], null, 2);

    // Assert the result
    expect(result).toEqual(expectedResult);
  });


});
