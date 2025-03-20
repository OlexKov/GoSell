import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./baseQuery";
import { IAdvert, IAdvertPageRequest, IAdvertImage } from "../../models/advert";
import { PageResponse } from "../../models/user";

export const advertApi = createApi({
  reducerPath: "advertApi",
  baseQuery: createBaseQuery("Advert"),
  tagTypes: ["Adverts", "AdvertImages", "NotApproved", "Locked", "Advert"],

  endpoints: (builder) => ({
    getAllAdverts: builder.query<IAdvert[], void>({
      query: () => ({
        url: `get`,
        method: "GET",
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertById: builder.query<IAdvert, number>({
      query: (id) => ({
        url: `get/${id}`,
        method: "GET",
      }),
      providesTags: ["Advert"],
    }),

    getAdvertPage: builder.query<PageResponse<IAdvert>, IAdvertPageRequest>({
      query: (pageRequest) => ({
        url: `get/page`,
        method: "POST",
        body: pageRequest,
      }),
      providesTags: (result, _error, pageRequest) => {
        if (!result) {
          if (pageRequest.blocked) {
            return ["Locked"];
          }
          if (pageRequest.approved) {
            return ["Adverts"];
          }
          return ["NotApproved"];
        }
        else {
          if (pageRequest.blocked) {
            return [
              "Locked",
              { type: "Locked", id: pageRequest.page },
            ];;
          }
          if (pageRequest.approved) {
            return [
              "Adverts",
              { type: "Adverts", id: pageRequest.page },
            ];
          }
          return [
            "NotApproved",
            { type: "NotApproved", id: pageRequest.page },
          ];
        }

      },
    }),

    getAdvertsByRange: builder.query<IAdvert[], number[]>({
      query: (ids) => ({
        url: `get/range`,
        method: "POST",
        body: ids,
      }),
      providesTags: ["Adverts"],
    }),

    getAdvertImages: builder.query<IAdvertImage[], number>({
      query: (id) => ({
        url: `get/images/${id}`,
        method: "GET",
      }),
      providesTags: ["AdvertImages"],
    }),
  }),
});

export const {
  useGetAllAdvertsQuery,
  useGetAdvertByIdQuery,
  useGetAdvertPageQuery,
  useGetAdvertsByRangeQuery,
  useGetAdvertImagesQuery,
} = advertApi;
