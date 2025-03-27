import React, { useState, useEffect } from "react";
import "./style.scss";
import { TreeSelect, TreeSelectProps } from "antd";
import { IArea, IRegion, ISettlement } from "../../models/newPost";
import { LocationSelectProps } from "./props";
import {
    useGetAreasQuery,
    useGetRegionsByAreaQuery,
    useGetSettlementsByIdQuery,
    useGetSettlementsByRegionQuery,
} from "../../redux/api/newPostApi";
import { useSearchParams } from "react-router-dom";



const LocationSelect: React.FC<LocationSelectProps> = ({ onSelect }) => {
    const { data: areas } = useGetAreasQuery(undefined);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
    const [areaRef, setAreaRef] = useState<string | null>(null);
    const [regionRef, setRegionRef] = useState<string | null>(null);
    const [searchParams] = useSearchParams('');
    const initialArea = searchParams.get('areaRef') || undefined;
    const initialRegion = searchParams.get('regionRef') || undefined;
    const initialSettlement = searchParams.get('settlementRef') || undefined;
    const { data: regions } = useGetRegionsByAreaQuery(areaRef, { skip: !areaRef });
    const { data: settlements } = useGetSettlementsByRegionQuery(regionRef, { skip: !regionRef });
    const { data: selectedSettlement } = useGetSettlementsByIdQuery(initialSettlement!, { skip: !initialSettlement });

    useEffect(() => {
        if (initialSettlement && selectedSettlement) {
            setSelectedValue(initialSettlement);
            setRegionRef(selectedSettlement.region || null);
            setAreaRef(selectedSettlement.area || null);
        } else if (initialRegion) {
            setSelectedValue(initialRegion);
            setRegionRef(initialRegion);
            const areaFromSettlements = settlements?.find((s: ISettlement) => s.region === initialRegion)?.area || null;
            setAreaRef(areaFromSettlements);
        } else if (initialArea) {
            setSelectedValue(initialArea);
            setAreaRef(initialArea);
        }
        else {
            setSelectedValue(undefined);
        }
    }, [selectedSettlement, initialRegion, initialArea, settlements]);


    useEffect(() => {
        if (areas) {
            const formattedAreas = areas.slice()
                .sort((a: IArea, b: IArea) => a.description.localeCompare(b.description))
                .map((area: IArea) => ({
                    id: area.ref,
                    pId: null,
                    title: `${area.description} ${area.regionType}`,
                    value: area.ref,
                    isLeaf: false,
                }));
            setTreeData([
                {
                    id: "all-ukraine",
                    pId: null,
                    title: "Уся Україна",
                    value: "all-ukraine",
                    isLeaf: true,
                },
                ...formattedAreas,
            ]);
        }
    }, [areas]);

    useEffect(() => {
        if (regions) {
            const formattedRegions = regions.slice()
                .sort((a: IRegion, b: IRegion) => a.description.localeCompare(b.description))
                .map((region: IRegion) => ({
                    id: region.ref,
                    pId: region.areaRef,
                    title: `${region.description} ${region.regionType}`,
                    value: region.ref,
                    isLeaf: false,
                }));
            setTreeData((prevData) => [...prevData, ...formattedRegions]);
        }
    }, [regions]);

    useEffect(() => {
        if (settlements) {
            const formattedSettlements = settlements.slice()
                .sort((a: ISettlement, b: ISettlement) => a.description.localeCompare(b.description))
                .map((settlement: ISettlement) => ({
                    id: settlement.ref,
                    pId: settlement.region,
                    title: settlement.description,
                    value: settlement.ref,
                    isLeaf: true,
                }));
            setTreeData((prevData) => [...prevData, ...formattedSettlements]);
        }
    }, [settlements]);

    const onLoadData: TreeSelectProps['loadData'] = ({ id }) => {
        return new Promise<void>((resolve) => {
            if (areas?.some((area: IArea) => area.ref === id)) {
                setAreaRef(id);
            } else if (regions?.some((region: IRegion) => region.ref === id)) {
                setRegionRef(id);
            }
            resolve(undefined);
        });
    };

    const onClear = () => {
        setSelectedValue('all-ukraine');
        onSelect({
            areaRef: "",
            regionRef: "",
            settlementRef: ""
        });
    }

    const handleSelect = (value: string) => {
        setSelectedValue(value);

        if (value == 'all-ukraine') {
            onSelect({
                areaRef: "",
                regionRef: "",
                settlementRef: ""
            });
            return;
        }

        const selectedArea = areas?.find((a: IArea) => a.ref === value);
        const selectedRegion = regions?.find((r: IRegion) => r.ref === value);
        const selectedSettlement = settlements?.find((s: ISettlement) => s.ref === value);

        onSelect({
            areaRef: selectedArea?.ref || "",
            regionRef: selectedRegion?.ref || "",
            settlementRef: selectedSettlement?.ref || ""
        });
    };

    return (
        <TreeSelect
            allowClear
            treeDataSimpleMode
            value={selectedValue}
            className="location-select text-[#3a211c] font-montserrat text-base font-normal leading-normal w-[20.16vw] h-11 p-2.5 rounded-lg border border-[#9b7a5b]/50 justify-start items-center inline-flex text-adaptive-input-form-text"
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            prefix={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#9B7A5B" />
                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#9B7A5B" />
            </svg>}
            placeholder="Уся Україна"
            treeData={treeData}
            loadData={onLoadData}
            onSelect={handleSelect}
            onClear={onClear}
        />
    );
};

export default LocationSelect;