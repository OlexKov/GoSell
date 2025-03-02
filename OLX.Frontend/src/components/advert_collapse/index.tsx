import { ExpandMore } from "@mui/icons-material"
import { Collapse } from "antd"
import './style.scss'
import { CollpaseProps } from "./pros"


const Collapsed: React.FC<CollpaseProps> = ({ title, className, children, onOpen ,isOpen }) => {
    return (
        <div className="collapsed">
            <Collapse
                accordion={true}
                defaultActiveKey={isOpen ? ['1'] : undefined}
                onChange={onOpen}
                className={className}
                expandIconPosition='end'
                ghost
                expandIcon={({ isActive }) => (
                    <ExpandMore
                        style={{
                            fontSize: 25,
                            transform: isActive ? "rotate(-90deg)" : "rotate(0deg)",
                            transition: "transform 0.3s",
                        }}
                    />
                )}
                items={[
                    {
                        key: '1',
                        label: title,
                        children: children
                    }
                ]} />
        </div>
    )
}

export default Collapsed