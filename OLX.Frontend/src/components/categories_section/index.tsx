import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi"
import PrimaryButton from "../buttons/primary_button";
import { useMemo } from "react";

const CategoriesSection = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const navigate = useNavigate();
  const onClick = (id: number) => {
    navigate(`/adverts?categoryId=${id}`)
  }

  const categoryButtons = useMemo(() => categories?.filter(i => i.id != 4).slice(0, 9).map((category) => (
    <PrimaryButton
      onButtonClick={() => onClick(category.id)}
      key={category.id}
      title={category.name}
      isLoading={false}
      fontSize="clamp(14px,2.2vh,30px)"
      bgColor="transparent"
      brColor="#9B7A5B"
      fontColor="black"
      className={`w-[11.5vw] h-[4.2vh] transition-all duration-300 ease-in-out hover:scale-[1.1]  hover:shadow-xl`} />
  )) || [], [categories])


  return (
    <div className="my-[40px] w-full  gap-[6vh] flex flex-col">
      <h2 className='text-[#3A211C] font-unbounded text-adaptive-login-header-text font-normal text-center'>Популярні категорії</h2>
      <div className="flex  w-[100%]  justify-between">
        {...categoryButtons.slice(0, 5)}
      </div>
      <div className="w-[100%] px-[6vw]  flex justify-around ">
        {...categoryButtons.slice(5, 9)}
      </div>
    </div>
  )
}

export default CategoriesSection