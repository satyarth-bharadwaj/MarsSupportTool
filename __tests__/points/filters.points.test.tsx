import filteringLogic from "~/points/filters";

describe("filteringLogic function", () => {
  const mockResponse1 = {
    lineItems: [
      {
        eventId: "f218f0ab-e4d1-4389-90a7-93c98d0a32e1",
        activityType: "Credited",
        transactionReference: "8212f309-0786-41ee-9906-154e2e4779b2",
        amount: 28,
        dateTime: "2024-05-08T06:40:00.349Z",
        authorisedId: "trn:tesco:uid:uuid:26006002-5a26-4af5-a526-99b3cf6ef8e2",
        customerId: "trn:tesco:uid:uuid:3e78eec4-63d3-4e1d-9502-84f92a803699",
        locationId: "trn:tesco:tescolocation:branch:GB:4348",
        locationUuid: "9f66c22c-3d81-44f0-b77e-b2a824a613df",
      },
      {
        eventId: "0b2d88b7-a4ea-42d1-a257-2c163b85c953",
        activityType: "Credited",
        transactionReference: "3ae89395-0471-4950-a24d-9475f6394742",
        amount: 14,
        dateTime: "2024-06-08T06:37:24.183Z",
        authorisedId: "trn:tesco:uid:uuid:26006002-5a26-4af5-a526-99b3cf6ef8e2",
        customerId: "trn:tesco:uid:uuid:3e78eec4-63d3-4e1d-9502-84f92a803699",
        locationId: "trn:tesco:tescolocation:branch:GB:4348",
        locationUuid: "9f66c22c-3d81-44f0-b77e-b2a824a613df",
      },
    ],
  };
  const mockResponse2 = {
    createdAt: "2022-06-24T10:35:42.788Z",
    schemaVersion: "2022-6-24",
    createdBy: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
    customerId: "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
    id: "account-profile:trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
    schemes: {
      "UKClubcard.UKAirmiles": {
        snapshots: [],
        name: "UKClubcard.UKAirmiles",
        opened: "2023-07-17T09:31:09.571",
        events: [
          {
            dateTime: "2023-07-17T09:31:09.571Z",
            optedIn: true,
            id: "39e90e1b-4252-4707-a6c2-dfee91a8d6eb",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:b1cf0673-b053-43c5-8355-4101cf24e7ff",
            requestId: "3f2b15ef-3e5b-4d5f-a235-37127c617478",
          },
        ],
      },
      "UKClubcard.UKColleagueDiscount": {
        snapshots: [],
        name: "UKClubcard.UKColleagueDiscount",
        opened: "2022-06-22T11:43:59.318",
        events: [
          {
            dateTime: "2022-06-22T11:43:59.318Z",
            optedIn: true,
            id: "b9587be2-fa29-4cd1-b79f-9a372b2e6220",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:2999f167-4d28-391b-b5c0-27194e66e15c",
            requestId:
              "trn:tesco:uid:uuid:2999f167-4d28-391b-b5c0-27194e66e15c",
          },
          {
            dateTime: "2022-06-28T12:23:39.059Z",
            id: "9cba283c-2189-466e-8015-5e447027057a",
            type: "AccountMergedFrom",
            mergedFrom: [
              "trn:tesco:uid:uuid:9651d2c3-425d-41df-9a12-430814cb13f6",
            ],
          },
        ],
      },
      UKColleagueDiscount: {
        snapshots: [],
        name: "UKColleagueDiscount",
        opened: "2021-08-05T11:28:14.606Z",
        events: [
          {
            dateTime: "2021-08-05T13:09:33.332Z",
            id: "da6c69a8-fa8d-4269-917d-12c5fd7436f7",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
            requestId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
          },
          {
            dateTime: "2022-06-28T12:23:39.059Z",
            id: "7261b9bd-30ec-4b12-98b1-d7c5a0eb9eea",
            type: "AccountMergedFrom",
            mergedFrom: [
              "trn:tesco:uid:uuid:9651d2c3-425d-41df-9a12-430814cb13f6",
            ],
          },
        ],
      },
      UKClubcard: {
        snapshots: [],
        name: "UKClubcard",
        opened: "2022-06-24T10:35:42.788Z",
        events: [
          {
            dateTime: "2022-06-24T10:35:42.788Z",
            id: "7f2ad2e6-a303-42df-a5df-f6f8e98dd14c",
            type: "DebitDisabled",
            authorisedId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
            requestId: "91fe562f-22c6-4135-8cf0-2ea94cb74922",
          },
        ],
      },
      "UKClubcard.UKSavers": {
        snapshots: [],
        name: "UKClubcard.UKSavers",
        opened: "2022-06-27T05:48:20.608",
        events: [
          {
            dateTime: "2022-06-27T05:48:20.608Z",
            optedIn: false,
            id: "89b64a04-fe62-44a7-b8b8-4ae7059cf188",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
            requestId: "6354ff11-0f12-46ad-9bab-778f45ba86bd",
          },
          {
            dateTime: "2022-06-27T06:21:35.476Z",
            optedIn: true,
            id: "f569d408-b2b2-41d5-a04e-2e97f57f3de1",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
            requestId: "66b0d8ea-422a-4b3d-83bc-d4c4b245282c",
          },
        ],
      },
      "UKClubcard.UKEstamps": {
        snapshots: [],
        name: "UKClubcard.UKEstamps",
        opened: "2024-02-08T14:11:33.657",
        events: [
          {
            dateTime: "2024-02-08T14:11:33.657Z",
            optedIn: false,
            id: "c3be46eb-2b0b-44b8-9e82-71363bfe52af",
            type: "AccountOpened",
            authorisedId:
              "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
            requestId: "967e2ceb-a1a3-413d-87c1-288bf7c672ac",
          },
        ],
      },
    },
    type: "account-profile",
  };
  ///Mock response
  // const mockResponse3 = {
  //   snapshots: [
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-24T12:14:36.697Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-24T11:57:06.787Z",
  //           balance: 200,
  //         },
  //       ],
  //       id: "cc33fede-61f9-4b2c-b986-ab900306e135",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7t9",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-24T13:43:38.418Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-24T11:57:06.787Z",
  //           balance: 200,
  //         },
  //       ],
  //       id: "9b24d218-73ff-448d-a834-062edfc6ac18",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7t9",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-27T06:00:43.116Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-24T11:57:06.787Z",
  //           balance: 200,
  //         },
  //       ],
  //       id: "d0262379-61f2-48d0-b851-1be62e34859a",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7t9",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-27T06:21:35.476Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-24T11:57:06.787Z",
  //           balance: 200,
  //         },
  //       ],
  //       id: "eb40f06e-994e-41c3-a48d-015ca2a4485a",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7t9",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-27T06:54:11.101Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-24T11:57:06.787Z",
  //           balance: 500,
  //         },
  //       ],
  //       id: "e3442e1c-b247-4460-bb0d-f5e4830d7b2c",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7tb",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-28T12:47:47.157Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-28T12:47:47.157Z",
  //           balance: 700,
  //         },
  //       ],
  //       id: "0791492a-7220-4b61-8392-57b8c568eae0",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7tb",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-06-29T09:46:20.036Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2022-06-28T12:47:47.157Z",
  //           balance: 700,
  //         },
  //       ],
  //       id: "829d3b4c-221b-4883-8413-acb1d52c03d8",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7tb",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2022-10-19T11:08:06.388Z",
  //       entries: [],
  //       id: "2d07a1e1-71f3-43a2-9146-3dd10dd29a78",
  //       lastEventId: "b1cf0673-b053-43c5-8355-4101cf24e7tb",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2023-07-27T09:50:01.209Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "Reward Partner bonus points",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2023-07-24T13:32:11.213Z",
  //           balance: 100,
  //         },
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2023-07-17T09:35:42.703Z",
  //           balance: 20000,
  //         },
  //       ],
  //       id: "98b15b53-40d6-48c8-a3e8-487c74551efa",
  //       lastEventId: "20f86aa7-22ab-4a2e-b2c3-ea8e125906r",
  //     },
  //     {
  //       expiredPointsEntries: [],
  //       createdAt: "2023-10-30T07:12:28.654Z",
  //       entries: [
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "Tesco Cafe",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2023-09-11T10:47:27.851Z",
  //           balance: 111,
  //         },
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "Reward Partner bonus points",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2023-07-24T13:32:11.213Z",
  //           balance: 100,
  //         },
  //         {
  //           customerId:
  //             "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //           funderName: "DEFAULT",
  //           expiresOn: "3018-03-31T23:59Z",
  //           validFrom: "2023-07-17T09:35:42.703Z",
  //           balance: 20000,
  //         },
  //       ],
  //       id: "7a6aa71b-5f19-4979-aace-af3fad584b78",
  //       lastEventId: "credit-cz-1-15",
  //     },
  //   ],
  //   createdAt: "2022-06-24T10:35:42.788Z",
  //   archives: [],
  //   schemaVersion: "2022-6-24",
  //   balance: 20211,
  //   createdBy: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //   customerId: "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //   schemeId: "UKClubcard",
  //   id: "account-txn:UKClubcard:trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
  //   type: "account-txn",
  //   events: [
  //     {
  //       dateTime: "2022-06-24T11:57:06.787Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test transfer",
  //       },
  //       id: "b1cf0673-b053-43c5-8355-4101cf24e7t9",
  //       validFrom: "2022-06-24T11:57:06.787Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 100,
  //     },
  //     {
  //       dateTime: "2022-06-27T06:36:29.147Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test transfer",
  //       },
  //       id: "b1cf0673-b053-43c5-8355-4101cf24e7tt",
  //       validFrom: "2022-06-27T06:36:29.147Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 200,
  //     },
  //     {
  //       dateTime: "2022-06-27T06:36:43.559Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test transfer",
  //       },
  //       id: "b1cf0673-b053-43c5-8355-4101cf24e7th",
  //       validFrom: "2022-06-27T06:36:43.559Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 100,
  //     },
  //     {
  //       dateTime: "2022-06-27T06:37:21.577Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test transfer",
  //       },
  //       id: "b1cf0673-b053-43c5-8355-4101cf24e7th",
  //       type: "CreditVoided",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 100,
  //     },
  //     {
  //       dateTime: "2022-06-27T06:37:40.067Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test transfer",
  //       },
  //       id: "b1cf0673-b053-43c5-8355-4101cf24e7tb",
  //       validFrom: "2022-06-27T06:37:40.067Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 100,
  //     },
  //     {
  //       dateTime: "2022-10-19T11:50:35.230Z",
  //       locationId: "trn:tesco:tescolocation:branch:GB:2041",
  //       eventDescription: {
  //         language: "en-gb",
  //         text: "test credit",
  //       },
  //       id: "20f86aa7-22ab-4a2e-b2c3-ea8e125906r",
  //       validFrom: "2022-10-19T11:50:35.230Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 200,
  //     },
  //     {
  //       dateTime: "2023-09-11T10:47:27.851Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-3",
  //       validFrom: "2023-09-11T10:47:27.851Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 100,
  //     },
  //     {
  //       dateTime: "2023-09-11T11:31:33.870Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-5",
  //       validFrom: "2023-09-11T11:31:33.870Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T11:39:12.774Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-6",
  //       validFrom: "2023-09-11T11:39:12.774Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T11:49:43.382Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-7",
  //       validFrom: "2023-09-11T11:49:43.382Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T11:51:30.188Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-8",
  //       validFrom: "2023-09-11T11:51:30.188Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T11:56:58.103Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-9",
  //       validFrom: "2023-09-11T11:56:58.103Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T12:02:42.554Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-10",
  //       validFrom: "2023-09-11T12:02:42.554Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T12:03:16.209Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-11",
  //       validFrom: "2023-09-11T12:03:16.209Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T12:06:49.648Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-12",
  //       validFrom: "2023-09-11T12:06:49.648Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-11T12:50:54.555Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-13",
  //       validFrom: "2023-09-11T12:50:54.555Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-12T03:52:37.146Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-14",
  //       validFrom: "2023-09-12T03:52:37.146Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //     {
  //       dateTime: "2023-09-12T05:32:56.054Z",
  //       funder: "Tesco Cafe",
  //       id: "credit-cz-1-15",
  //       validFrom: "2023-09-12T05:32:56.054Z",
  //       type: "Credited",
  //       authorisedId: "trn:tesco:uid:uuid:2ea74be1-57c7-32ef-b752-ef42d70cb1c4",
  //       value: 1,
  //     },
  //   ],
  // };
  it("case 2", () => {
    const toggle = "2";
    const selectedFilters = ["eventId", "dateTime"];
    const expectedJson = {
      lineItems: [
        {
          eventId: "f218f0ab-e4d1-4389-90a7-93c98d0a32e1",
          dateTime: "2024-05-08T06:40:00.349Z",
        },
        {
          eventId: "0b2d88b7-a4ea-42d1-a257-2c163b85c953",
          dateTime: "2024-06-08T06:37:24.183Z",
        },
      ],
    };
    expect(
      JSON.parse(filteringLogic(toggle, "", "", selectedFilters, mockResponse1))
    ).toEqual(expectedJson);
  });
  it("case 7", () => {
    const toggle = "7";
    const selectedFilters = ["createdAt", "schemaVersion", "customerId"];
    const expectedJson = {
      createdAt: "2022-06-24T10:35:42.788Z",
      schemaVersion: "2022-6-24",
      customerId: "trn:tesco:uid:uuid:7fb134d8-2b4a-4fd4-8858-8cb85db34db6",
    };

    expect(
      JSON.parse(filteringLogic(toggle, "", "", selectedFilters, mockResponse2))
    ).toEqual(expectedJson);
  });
});
