import { useCheckPasswordMutation } from "../redux/api/accountAuthApi";
import { confirm } from "../utilities/confirm_modal";
import { Input } from "antd";

const useAdminPasswordCheck = () => {
    const [checkPassword] = useCheckPasswordMutation()

   
    const passwordCheck = (): Promise<boolean> => {
            return new Promise((resolve) => {
                let password = ""
                confirm({
                    title: (
                        <span className="font-unbounded font-medium text-wrap text-adaptive-1_7_text text-[red]">
                            Введіть пароль адміністратора
                        </span>
                    ),
                    content: (
                        <Input.Password
                            className="h-[5vh] min-w-[20vw] my-[2vh] flex-shrink-0 font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="пароль адміністратора"
                            onChange={(e) => (password = e.target.value)}
                        />
                    ),
                    onOk: async () => {
                        const result = await checkPassword(password);
                        resolve(!result.error);
                    },
                    onCancel: () => {
                        resolve(false);
                    },
                    okText: "Підтвердити",
                });
            });
        };

    return { passwordCheck };
};

export default useAdminPasswordCheck;