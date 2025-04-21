import getStatusColor from "~/coupon/statusCode";

describe('getStatusColor function', () => {
  it('should return "green" for statusCode 200', () => {
    const result = getStatusColor('200');
    expect(result).toBe('green');
  });

  it('should return "orange" for statusCode 401', () => {
    const result = getStatusColor('401');
    expect(result).toBe('orange');
  });

  it('should return "red" for other statusCode', () => {
    const result = getStatusColor('404'); // Any status code other than 200 and 401
    expect(result).toBe('red');
  });

  it('should return "red" for null statusCode', () => {
    const result = getStatusColor(null);
    expect(result).toBe('red');
  });
});
