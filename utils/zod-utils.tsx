import { z } from "zod";

export const GetPromotion = z
  .object({
    id: z.string(),
    category: z.string(),
    description: z.string(),
    barcode: z.string(),
    country: z.string(),
    currency: z.string(),
    value: z.string(),
    redemptionStartDate: z.string(),
    redemptionEndDate: z.string(),
    redemptionLimit: z.number(),
    subType: z.string(),
  })
  .passthrough();

export const GetCouponDetails = z
  .object({
    found: z.array(
      z.object({
        promotionId: z.string(),
        redemptionsLeft: z.number(),
        validFrom: z.string(),
        expiresOn: z.string(),
        state: z.string(),
        scheme: z.string(),
        promotionDetails: z
          .object({
            type: z.string(),
            description: z.string(),
            value: z.string().optional(),
            currency: z.string().optional(),
            country: z.string().optional(),
            scannableCode: z.string(),
            subType: z.string().optional(),
          })
          .passthrough(),
        couponId: z.string(),
        keyInCode: z.string().optional(),
        scannableCode: z.string().optional(),
        issuedToCustomerId: z.string(),
        maxRedemptionsLimit: z.number(),
      })
    ),
    notFound: z.array(z.string()),
  })
  .passthrough();

export const GetCustomerDetails = z.array(
  z
    .object({
      promotionId: z.string(),
      redemptionsLeft: z.number(),
      validFrom: z.string(),
      expiresOn: z.string(),
      state: z.string(),
      scheme: z.string(),
      promotionDetails: z
        .object({
          type: z.string(),
          description: z.string(),
          scannableCode: z.string(),
        })
        .passthrough(),
      couponId: z.string(),
      scannableCode: z.string(),
      issuedToCustomerId: z.string(),
      maxRedemptionsLimit: z.number(),
    })
    .passthrough()
);

export const GetExpiryData = z
  .object({
    coupons: z.array(
      z.object({
        expiresOn: z.string(),
      })
    ),
  })
  .passthrough();
export const GetBalance = z
  .object({
    balance: z.number(),
    debitableBalance: z.number(),
    isDebitable: z.boolean(),
    accountStatus: z.string(),
    opened: z.string(), // Consider using z.date() if you want to parse the date string into a Date object
  })
  .passthrough();
const LineItemSchema = z
  .object({
    eventId: z.string(),
    activityType: z.string(),
    amount: z.number(),
    dateTime: z.string(), // Consider using z.date() if you want to parse the date string into a Date object
    authorisedId: z.string(),
    customerId: z.string(),
  })
  .passthrough();

const LineItemsSchema = z.array(LineItemSchema);

export const GetStatement = z
  .object({
    lineItems: LineItemsSchema,
  })
  .passthrough();

const DetailsSchema = z
  .object({
    membershipNumber: z.string(),
    airline: z.string(),
  })
  .passthrough();

export const GetPreference = z
  .object({
    preferenceType: z.string(),
    details: DetailsSchema.optional(),
  })
  .passthrough();
export const GetScheme = z.object({
  schemes: z.array(z.string()),
});
const membersSchema = z.array(z.string());

// Define the schema for the entire object
export const getGroup = z
  .object({
    members: membersSchema,
    createdAt: z.string(),
    ownerId: z.string(),
    groupId: z.string(),
  })
  .passthrough();
export const GetGroupProfile = z
  .object({
    createdAt: z.string(), // Consider using z.date() if you want to parse the date string into a Date object
    secondaryCustomerId: z.string(),
    schemaVersion: z.string(),
    primaryCustomerId: z.string(),
    groupId: z.string(),
    members: z.array(z.string()),
    groupState: z.string(),
    type: z.string(),
    ownerId: z.string(),
    updatedAt: z.string(), // Consider using z.date() if you want to parse the date string into a Date object
  })
  .passthrough();

// const Entry = z
//   .object({
//     customerId: z.string(),
//     funderName: z.string(),
//     expiresOn: z.string(),
//     validFrom: z.string(),
//     balance: z.number(),
//   })
//   .passthrough();

// const Snapshot = z
//   .object({
//     expiredPointsEntries: z.array(Entry),
//     createdAt: z.string(),
//     entries: z.array(Entry),
//     id: z.string(),
//     lastEventId: z.string(),
//   })
//   .passthrough();

// const Event = z
//   .object({
//     dateTime: z.string(),
//     locationId: z.string(),
//     eventDescription: z
//       .object({
//         language: z.string(),
//         text: z.string(),
//       })
//       .passthrough(),
//     id: z.string(),
//     validFrom: z.string().optional(),
//     type: z.string(),
//     authorisedId: z.string(),
//     value: z.number(),
//   })
//   .passthrough();

// Define the entry schema
const entrySchema = z
  .object({
    customerId: z.string(),
    funderName: z.string(),
    expiresOn: z.string(),
    validFrom: z.string(),
    balance: z.number(),
  })
  .passthrough();

// Define the event description schema
const eventDescriptionSchema = z
  .object({
    language: z.string(),
    text: z.string(),
  })
  .passthrough();

// Define the event schema
const eventSchema = z
  .object({
    dateTime: z.string(),
    locationId: z.string(),
    eventDescription: eventDescriptionSchema,
    id: z.string(),
    type: z.string(),
    authorisedId: z.string(),
    value: z.number(),
    validFrom: z.string().optional(),
    funder: z.string().optional(),
  })
  .passthrough();

// Define the snapshot schema
const snapshotSchema = z
  .object({
    expiredPointsEntries: z.array(z.any()),
    createdAt: z.string(),
    entries: z.array(entrySchema),
    id: z.string(),
    lastEventId: z.string(),
  })
  .passthrough();

// Define the schema for the entire JSON object
export const GetAccountprofileDoc = z
  .object({
    snapshots: z.array(snapshotSchema),
    createdAt: z.string(),
    archives: z.array(z.object({})),
    schemaVersion: z.string(),
    balance: z.number(),
    createdBy: z.string(),
    customerId: z.string(),
    schemeId: z.string(),
    id: z.string(),
    type: z.string(),
    events: z.array(eventSchema),
  })
  .passthrough();
const ExchangeRateSchema = z
  .object({
    minThresholdRate: z
      .object({
        minThreshold: z.string(),
        minThresholdExchangeValue: z.string(),
      })
      .passthrough(),
    minDenominationRate: z
      .object({
        minDenomination: z.string(),
        minDenominationExchangeValue: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

const NextTargetSchema = z
  .object({
    fromValueToBeCollected: z.string(),
    toValue: z.string(),
  })
  .passthrough();

const PointsToAirmilesSchema = z
  .object({
    fromValue: z.string(),
    toValue: z.string(),
    exchangeRate: ExchangeRateSchema,
    maxThresholdReached: z.boolean(),
    maxThreshold: z.string(),
    nextTarget: NextTargetSchema,
  })
  .passthrough();

export const GetEstimation = z
  .object({
    pointsToAirmiles: PointsToAirmilesSchema,
  })
  .passthrough();

const collectionPeriodSchema = z
  .object({
    collectionPeriodNumber: z.number(),
    collectionPeriodDescription: z.string(),
    collectionPeriodStartDate: z.string(), // You might want to use z.date() here if the dates are always in ISO format
    collectionPeriodEndDate: z.string(), // You might want to use z.date() here if the dates are always in ISO format
    statementLandingDate: z.string(), // You might want to use z.date() here if the dates are always in ISO format
    pointsThreshold: z.number(),
    pointsToRewardConversion: z.number(),
  })
  .passthrough();
export const GetCollection = z.array(collectionPeriodSchema);

const fdvFreezePeriodSchema = z
  .object({
    isFdvFreezePeriod: z.boolean(),
  })
  .passthrough();

// Define the schema for statementFreezePeriod object
const statementFreezePeriodSchema = z
  .object({
    isStatementFreezePeriod: z.boolean(),
  })
  .passthrough();

// Define the combined schema for the entire object
export const GetFreezeperiod = z
  .object({
    fdvFreezePeriod: fdvFreezePeriodSchema,
    statementFreezePeriod: statementFreezePeriodSchema,
  })
  .passthrough();
