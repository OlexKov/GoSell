﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Olx.BLL.DTOs.NewPost;
using Olx.BLL.Entities.NewPost;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.NewPost;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;
using System.Text;

namespace Olx.BLL.Services
{
    
    public class NewPostService(
        IConfiguration configuration,
        IRepository<Area> areaRepository,
        IRepository<Region> regionRepository,
        IRepository<Settlement> settlementRepository,
        IMapper mapper,
        ILogger<NewPostService> logger) : INewPostService
    {
        private bool _disposedValue;
        private readonly HttpClient _httpClient = new();
        private readonly string _newPostKey = configuration.GetValue<string>("NewPostApiKey")!;
        private readonly string _newPostUrl = configuration.GetValue<string>("NewPostApiUrl")!;

        private async Task<IEnumerable<T>> GetNewPostData<T>(string modelName,
            string calledMethod,
            int page = 1 ,
            int limit = 200,
            string areaRef = ""
            ,string region = "",
            string settlementRef = "") 
        {
            NewPostRequestModel postModel = new(_newPostKey, modelName, calledMethod, page, limit, areaRef,region, settlementRef);
            string json = JsonConvert.SerializeObject(postModel);
            HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PostAsync(_newPostUrl, content);
            if (response.IsSuccessStatusCode)
            {
                var requestResult = await response.Content.ReadAsStringAsync();
                if (requestResult is not null)
                {
                    requestResult = requestResult.Trim('[', ']');
                    var result = JsonConvert.DeserializeObject<NewPostResponseModel<T>>(requestResult);
                    if (result != null && result.Data.Length > 0)
                    {
                        return result.Data;
                    }
                }
                return [];
            }
            else
            {
                throw new Exception(Errors.NewPostRequestError);
            }
        }

        public async Task<IEnumerable<Area>> GetAreasDataAsync() => await GetNewPostData<Area>("Address", "getSettlementAreas");

        public async Task<IEnumerable<Settlement>> GetSettlementsDataAsync(IEnumerable<Region> regions)
        {
            List<Settlement> settlements = [];
            int page = 1;
            while (true)
            {
                var result = await GetNewPostData<Settlement>("Address", "getSettlements", page++,500);
                if (result.Any())
                {
                    settlements.AddRange(result);
                }
                else
                {
                    break;
                }
            };
            
            settlements.AsParallel().ForAll(settlement => 
            {
                if (String.IsNullOrWhiteSpace(settlement.Region)) 
                {
                    settlement.Region = regions.FirstOrDefault(region => region.AreasCenter == settlement.Ref)?.Ref;
                }
            });

            return settlements.AsParallel()
                .GroupBy(x => x.Ref)
                .Select(z => z.First());
        }

        public async Task<IEnumerable<Region>> GetRegionsDataAsync(IEnumerable<string> areaRefs)
        {
            List<Region> result = [];
            foreach (var areaRef in areaRefs)
            {
                var regions = await GetNewPostData<Region>("Address", "getSettlementCountryRegion", areaRef: areaRef);
                if (regions.Any())
                {
                    regions.AsParallel().ForAll(region => region.AreaRef = areaRef);
                    result.AddRange(regions);
                }
            }
            return result.AsParallel()
                .GroupBy(x => x.Ref)
                .Select(z => z.First());
        }

        public async Task<IEnumerable<AreaDto>> GetAreasAsync() =>  await mapper.ProjectTo<AreaDto>(areaRepository.GetQuery()).ToArrayAsync();

        public async Task<IEnumerable<WarehousDto>> GetWarehousesBySettlementAsync(string settlementRef)
        {
            var result = await GetNewPostData<WarehousDto>("Address", "getWarehouses", settlementRef: settlementRef)
                ?? throw new HttpException(Errors.NewPostRequestError, HttpStatusCode.InternalServerError);
            return mapper.Map<IEnumerable<WarehousDto>>(result);
        }

        public async Task<IEnumerable<SettlementDto>> GetSettlementsByRegionAsync(string regionRef) 
        {
            if (!await regionRepository.AnyAsync(x => x.Ref == regionRef))
            {
                throw new HttpException(Errors.InvalidRegionRef, HttpStatusCode.BadRequest);
            }
            return await mapper.ProjectTo<SettlementDto>(settlementRepository.GetQuery().Where(x => x.Region == regionRef)).ToArrayAsync();
        }
            

        public async Task<IEnumerable<RegionDto>> GetRegionsAsync() =>
           await  mapper.ProjectTo<RegionDto>(regionRepository.GetQuery()).ToArrayAsync();

        public async Task<IEnumerable<RegionDto>> GetRegionsByAreaAsync(string areaRef) 
        {
            if (!await areaRepository.AnyAsync(x => x.Ref == areaRef))
            {
                throw new HttpException(Errors.InvalidAreaRef, HttpStatusCode.BadRequest);
            }
            return await mapper.ProjectTo<RegionDto>(regionRepository.GetQuery().Where(x => x.AreaRef == areaRef)).ToArrayAsync();
        }
            

        public async Task UpdateNewPostData()
        {
            try 
            {
                logger.LogInformation("{info}", Messages.AreasUpdate);
                var areasData = await GetAreasDataAsync();
                var areas = await areaRepository.GetListBySpec(new NewPostDataSpecs.GetAreas(true));
                if (areas.Any())
                {
                    var areasTasks = areasData.Select(async (areaData) =>
                    {
                        var area = areas.FirstOrDefault(x => x.Ref == areaData.Ref);
                        if (area is not null)
                        {
                            mapper.Map(areaData,area);
                        }
                        else
                        {
                            await areaRepository.AddAsync(areaData);
                        }
                    });
                    await Task.WhenAll(areasTasks);
                }
                else
                {
                    await areaRepository.AddRangeAsync(areasData);
                }
                await areaRepository.SaveAsync();

                logger.LogInformation("{info}", Messages.RegionsUpdate);
                var regionsData = await GetRegionsDataAsync(areasData.Select(x => x.Ref));
                var regions = await regionRepository.GetListBySpec(new NewPostDataSpecs.GetRegions(true));
                if (regions.Any())
                {
                    foreach (var regionData in regionsData)
                    {
                        var region = regions.AsParallel().FirstOrDefault(x => x.Ref == regionData.Ref);
                        if (region is not null)
                        {
                            mapper.Map(regionData, region);
                        }
                        else
                        {
                            await regionRepository.AddAsync(regionData);
                        }
                    }
                }
                else
                {
                    await regionRepository.AddRangeAsync(regionsData);
                }
                await regionRepository.SaveAsync();

                logger.LogInformation("{info}", Messages.SettlemensUpdate);

                var settlementsData = await GetSettlementsDataAsync(regionsData);
                var settlements = await settlementRepository.GetListBySpec(new NewPostDataSpecs.GetSettlements(true));
                if (settlements.Any())
                {
                    foreach (var settlementData in settlementsData)
                    {
                        var settlement = settlements.AsParallel().FirstOrDefault(x => x.Ref == settlementData.Ref);
                        if (settlement is not null)
                        {
                            mapper.Map(settlementData, settlement);
                        }
                        else
                        {
                            await settlementRepository.AddAsync(settlementData);
                        }
                    }
                }
                else
                {
                    await settlementRepository.AddRangeAsync(settlementsData);
                }
                await settlementRepository.SaveAsync();
                logger.LogInformation("{info}", Messages.NPUpdateCompleted);
                logger.LogInformation("{info}",string.Format(Messages.AreasCount, areasData.Count()));
                logger.LogInformation("{info}", string.Format(Messages.RegionsCount, regionsData.Count()));
                logger.LogInformation("{info}", string.Format(Messages.SettlementsCount, settlementsData.Count()));
            }
            catch(Exception e) 
            {
                logger.LogError("{error} {info}", Errors.NewPostDataUpdateError,e.Message);
                throw new HttpException(Errors.NewPostDataUpdateError, HttpStatusCode.InternalServerError);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposedValue)
            {
                if (disposing)
                {
                    _httpClient.Dispose();
                }
                _disposedValue = true;
            }
        }
        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }

        public async Task<SettlementDto> GetSettlement(string settlementRef) =>
            await mapper.ProjectTo<SettlementDto>(settlementRepository.GetQuery().Where(x => x.Ref == settlementRef)).FirstOrDefaultAsync()
            ?? throw new HttpException(Errors.InvalidSettlementRef,HttpStatusCode.BadRequest);


    }
}
