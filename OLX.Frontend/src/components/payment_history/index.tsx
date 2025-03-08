import { ConfigProvider, Table } from "antd";
import './styles.scss'

const PaymentHistory = () => {
    const columns = [
        {
            title: "Дата",
            dataIndex: "date",
            key: "date",
            className: "table-header",
        },
        {
            title: "Номер операції",
            dataIndex: "operationNumber",
            key: "operationNumber",
            className: "table-header",
        },
        {
            title: "Заголовок",
            dataIndex: "title",
            key: "title",
            className: "table-header",
        },
        {
            title: "Сума",
            dataIndex: "amount",
            key: "amount",
            className: "table-header",
        },
    ];

    const data : any[] = [
        {
            key: "1",
            date: "4 лип 2024",
            operationNumber: "376290167",
            title: "Набір платних послуг",
            amount: "-125.30 грн",
        },
        {
            key: "2",
            date: "10 чер 2024",
            operationNumber: "386428021",
            title: "Підняття в гору списку",
            amount: "-15.30 грн",
        },
        {
            key: "3",
            date: "4 лип 2024",
            operationNumber: "376290167",
            title: "Набір платних послуг",
            amount: "-125.30 грн",
        },
        {
            key: "4",
            date: "10 чер 2024",
            operationNumber: "386428021",
            title: "Підняття в гору списку",
            amount: "-15.30 грн",
        },
        {
            key: "5",
            date: "4 лип 2024",
            operationNumber: "376290167",
            title: "Набір платних послуг",
            amount: "-125.30 грн",
        },
        {
            key: "6",
            date: "10 чер 2024",
            operationNumber: "386428021",
            title: "Підняття в гору списку",
            amount: "-15.30 грн",
        },
    ];

    return (
        <div className="w-full mt-[-130px] mb-[100px]">
            <div className="flex flex-col items-end">
                <div className="flex gap-[10px] mb-[20px] w-[300px] justify-between">
                    <span>Ваш рахунок:</span>
                    <span className="w-[100px]">0 грн</span>
                </div>
                <div className="flex gap-[10px] w-[300px] justify-between">
                    <span>Доступний баланс:</span>
                    <span className="w-[100px]">0 бонусів</span>
                </div>
            </div>
            <div>
                <div className="text-[#3a211c] text-[2vh] font-medium font-unbounded leading-tight my-[60px]">Історія платежів</div>
                {data.length === 0 ?
                   <div className=" mt-[200px] mb-[200px] relative justify-center text-black text-base font-normal font-['Montserrat']">Тут зберігатиметься вся історія ваших платежів на GoSell</div>
                    : 
                    <ConfigProvider
                        theme={{
                            components: {
                                Table: {
                                    headerBg: "#ffffff",
                                    fontFamily: "Montserrat, sans-serif",
                                },
                                Pagination: {
                                    colorPrimary: "#ffffff",
                                },
                            },
                        }}
                    >
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 10, position: ["bottomCenter"] }}
                            className="custom-table"
                        />
                    </ConfigProvider>}
            </div>
        </div>
    )
}

export default PaymentHistory 