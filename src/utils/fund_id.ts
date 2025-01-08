import { FundType } from "@/types/types";

// Utility function to get fund ID
export function getFundId(type: FundType): number {
  const fundMap = {
    [FundType.booth]: 3,
    [FundType.university]: 4,
    [FundType.general]: 2,
    [FundType.main]: 1,
  };
  return fundMap[type];
}
