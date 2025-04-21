import filtersInitialDetails from "~/coupon/filtersDetails";

describe('filtersInitialDetails function', () => {
  it('should return the correct filters for toggle 1', () => {
    expect(filtersInitialDetails('1')).toEqual([
      'id',
      'category',
      'description',
      'barcode',
      'country',
      'currency',
      'value',
      'redemptionStartDate',
      'redemptionEndDate',
      'redemptionLimit',
      'subType',
    ]);
  });

  it('should return the correct filters for toggle 2', () => {
    expect(filtersInitialDetails('2')).toEqual([
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
  });

  it('should return the correct filters for toggle 3', () => {
    expect(filtersInitialDetails('3')).toEqual([
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
  });

  it('should return the correct filters for toggle 4', () => {
    expect(filtersInitialDetails('4')).toEqual(['expiresOn']);
  });

  it('should return the correct filters for toggle 5', () => {
    expect(filtersInitialDetails('5')).toEqual(['voucher']);
  });

  it('should return an empty array for unknown toggle', () => {
    expect(filtersInitialDetails('unknown')).toEqual(['']);
  });
});
