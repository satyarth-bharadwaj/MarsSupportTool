export interface FunderDetail {
    country: string;
    funderId: string;
    funderName: string;
  }
  
  export const countryToSchemeMap: Record<string, string> = {
    "UK": "UKClubcard",
    "ROI": "IEClubcard",
    "CZ": "CZClubcard",
    "SK": "SKClubcard",
    "HU": "HUClubcard"
  };
  
  export const allFunders: FunderDetail[] = [
    { country: "UK", funderId: "1106", funderName: "Reward Partner bonus points" },
    { country: "UK", funderId: "1107", funderName: "Tesco Clubcard Challenges" },
    { country: "UK", funderId: "1868", funderName: "Clubcard competition" },
    { country: "UK", funderId: "9999", funderName: "Unpacked Competition" },
    { country: "ROI", funderId: "1462", funderName: "Tesco Customer Survey" },
    { country: "ROI", funderId: "1448", funderName: "Tesco CEC CS points" },
    { country: "CZ", funderId: "9579782147", funderName: "Tesco zákaznická linka" },
    { country: "CZ", funderId: "7631849130", funderName: "Tesco Marketing" },
    { country: "SK", funderId: "9739609903", funderName: "Tesco zákaznícka linka" },
    { country: "SK", funderId: "8113882053", funderName: "Prevod z iného účtu" },
    { country: "HU", funderId: "3654552861", funderName: "Tesco Ügyfélszolgálat" },
    { country: "HU", funderId: "8220066824", funderName: "Pontátvitel törölt fiókról" }
  ];
  
  export const BATCH_SIZE = 50;
  export const BATCH_DELAY = 100;
  
  export const extractTimestampFromFilename = (filename: string): string => {
    const timestampMatch = filename.match(/(\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}\.\d{3}Z)/);
    if (timestampMatch) {
      return timestampMatch[1].replace(/_/g, ':');
    }
    return new Date().toISOString();
  };
  
  export const getFundersByCountry = (country: string): FunderDetail[] => {
    return allFunders.filter(funder => funder.country === country);
  };