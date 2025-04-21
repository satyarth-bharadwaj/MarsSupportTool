

const filtersInitialDetails =(toggle:string)=>{
    let filters: Array<string> = []; // Initialize filters array for the current toggle
    switch (toggle) {
        case '1':
          filters = [
            'id',
            'category',
            'description',
            'barcode', 'country', 'currency', 'value', 'redemptionStartDate', 'redemptionEndDate', 'redemptionLimit', 'subType',
          ];
          break;
        case '2':
          filters = [
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
          ];
          break;
        case '3':
          filters = [
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
            'maxRedemptionsLimit'
          ];
          break;
        case '4':
          filters = ['expiresOn'];
          break;
          
        case '5':
          filters = ['voucher'];
          break;
        default:
         filters=[""];
      break;
        }
        return filters;
}
export default filtersInitialDetails;