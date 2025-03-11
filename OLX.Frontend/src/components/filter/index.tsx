import { Button, Checkbox, Form } from "antd"
import { FilterProps } from "./props"
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const Filter: React.FC<FilterProps> = ({ filter, onChange, onReset }) => {
    const [searchParams] = useSearchParams('');
    const initFilter = useMemo((): number[] | undefined => {
        if (filter) {
            const filtersValues = searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]).flat() : []
            if (filtersValues.length > 0) {
                const filterValues = filter.values.map(x => x.id);
                return filtersValues.flat().filter(item => filterValues.some(x => x == item));
            }
        }
        return undefined;
    },[filter])
   
    const checkBoxes = useMemo(() => filter?.values.map(x =>
        <Checkbox className="filter-checkbox" style={{ fontSize: 'clamp(14px, 1.7vh, 36px)', fontWeight: 400 }} key={x.id} value={x.id}>{x.value}</Checkbox>
    ) || [], [filter])

    return (
        <Form.Item
            name={filter?.id}
            label={<span className="font-unbounded text-adaptive-1_6-text"> {filter?.name}</span>}
            initialValue={initFilter}
        >
            <Checkbox.Group
                className="flex flex-col flex-nowrap gap-[.3vh] max-h-[40vh] overflow-auto custom-scrollbar"
                onChange={onChange}>
                {...checkBoxes}
                <Button
                    size="small"
                    className=" self-start p-0  text-[red]"
                    type='link'
                    onClick={() => onReset && onReset(filter?.id)}>
                    Очистити
                </Button>
            </Checkbox.Group>
        </Form.Item>
    )
}

export default Filter