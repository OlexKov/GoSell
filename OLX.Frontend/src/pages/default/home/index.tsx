import AdvertsSection from '../../../components/adverts_section';
import HomePageImageBlock from '../../../components/home_page_image';
import PrimaryButton from '../../../components/buttons/primary_button';
import { useGetAdvertPageQuery } from '../../../redux/api/advertApi';
import './style.scss'
import { useState } from 'react';
import { IAdvertPageRequest } from '../../../models/advert';
import CategoriesSection from '../../../components/categories_section';


const HomePage: React.FC = () => {
  const [pageRequest, setPageRequest] = useState<IAdvertPageRequest>({
    page: 1,
    size: 8,
    sortKey: "date",
    isDescending: true,
    priceFrom: 0,
    priceTo: 0,
    approved: true,
    blocked: false,
    completed: false
  });
  const { data, isLoading } = useGetAdvertPageQuery(pageRequest);

  const loadMore = () => {
    if (pageRequest.size) {
      setPageRequest({ ...pageRequest, size: pageRequest.size + 4 });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center">
      <HomePageImageBlock />
      <div className='flex flex-col items-center mx-[8vw] py-[10vh] gap-[10vh]'>
        <CategoriesSection />
        <AdvertsSection title='Рекомендовані оголошення' adverts={data?.items} isLoading={isLoading} columns={4} />
        {!(data?.total === data?.items.length) &&
          <PrimaryButton
            onButtonClick={loadMore}
            title='Завантажити більше'
            isLoading={isLoading}
            className='w-[23vw] h-[6.4vh] p-[8px]'
            bgColor='#9B7A5B'
            fontColor='white'
            brColor='#9B7A5B' />
        }
      </div>
    </div>
  );
};

export default HomePage;