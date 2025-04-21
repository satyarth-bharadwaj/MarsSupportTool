export const isValidUUID = (uuid: string): boolean => {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
  };
  
  export const validateHeaders = (headers: string[]): boolean => {
    const expectedHeaders = ["Customer UUID", "Number of Points", "Funder ID", "Funder Name"];
    return expectedHeaders.every(header => 
      headers.map(h => h.trim().toLowerCase()).includes(header.trim().toLowerCase())
    );
  };
  
  export const validateFileName = (fileName: string, country: string): boolean => {
    const countryPatterns: { [key: string]: RegExp } = {
      UK: /UK|United[ _]?Kingdom/i,
      ROI: /ROI|Ireland|Republic[ _]?of[ _]?Ireland/i,
      CZ: /CZ|Czech/i,
      SK: /SK|Slovak/i,
      HU: /HU|Hungar/i
    };
    return countryPatterns[country]?.test(fileName) || false;
  };
  
  export const validateRow = (
    row: any, 
    uuidTracker: Map<string, number>,
    selectedFunderDetails?: { funderId: string; funderName: string } | null,
    templateFunderName?: string
  ): string[] => {
    const errors: string[] = [];
    const uuid = row["Customer UUID"]?.trim();
  
    if (!uuid) {
      errors.push("Customer UUID is required.");
    } else if (!isValidUUID(uuid)) {
      errors.push("Customer UUID must be a valid UUID.");
    } else {
      const count = uuidTracker.get(uuid) || 0;
      if (count > 0) errors.push("Duplicate Customer UUID detected.");
      uuidTracker.set(uuid, count + 1);
    }
  
    const pointsStr = row["Number of Points"]?.toString().trim();
    if (!pointsStr) {
      errors.push("Number of Points is required.");
    } else {
      const pointsNum = Number(pointsStr);
      if (isNaN(pointsNum)) {
        errors.push("Number of Points must be a valid number.");
      } else {
        if (!Number.isInteger(pointsNum)) errors.push("Number of Points must be an integer.");
        if (pointsNum < 0) errors.push("Number of Points cannot be negative.");
        if (pointsNum === 0) errors.push("Number of Points must be greater than 0.");
        if (pointsNum > 10000) errors.push("Number of Points must not exceed 10,000.");
      }
    }
  
    // Funder ID validation
    const funderId = row["Funder ID"]?.toString().trim();
    if (!funderId) {
      errors.push("Funder ID is required.");
    } else if (selectedFunderDetails && funderId !== selectedFunderDetails.funderId) {
      errors.push(`Funder ID must be ${selectedFunderDetails.funderId}`);
    }
  
    // Funder Name validation
    const funderName = row["Funder Name"]?.toString().trim();
    if (!funderName) {
      errors.push("Funder Name is required.");
    } else if (selectedFunderDetails && funderName !== selectedFunderDetails.funderName) {
      errors.push(`Funder Name must be ${selectedFunderDetails.funderName}`);
    }
  
    return errors;
  };
  
  export const validateCSV = (
    data: any[],
    selectedFunderDetails?: { funderId: string; funderName: string } | null,
    templateFunderName?: string
  ): { [key: string]: string[] } => {
    const errors: { [key: string]: string[] } = {};
    const uuidTracker = new Map<string, number>();
    
    data.forEach((row) => {
      const rowErrors = validateRow(row, uuidTracker, selectedFunderDetails, templateFunderName);
      if (rowErrors.length > 0) {
        errors[row["Customer UUID"]] = rowErrors;
      }
    });
  
    return errors;
  };
  
  export const preValidateCSV = (file: File, selectedCountry: string, selectedFunder: string): string | null => {
    if (!selectedCountry || !selectedFunder) {
      return "Please select both a country and funder before uploading a file.";
    }
    
    if (!file.name.endsWith(".csv")) {
      return "Please upload a valid CSV file.";
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB.";
    }
    
    if (!validateFileName(file.name, selectedCountry)) {
      return `File name doesn't match the selected country (${selectedCountry}).`;
    }
    
    return null;
  };