import { useMemo } from "react"
import { APP_ENV } from "../../constants/env"
import AdvertCard from "../advert_card"
import ScrolledContainer from "../scrolled_container"
import { IScrolledAdvertsSectionProps } from "./props"

const ScrolledAdvertsSection: React.FC<IScrolledAdvertsSectionProps> = ({ title, adverts,  className ,cardClassName}) => {

  const advertsCards = useMemo(() => adverts
    .map((advert) => (
      <AdvertCard
        key={advert.id}
        id={advert.id}
        title={advert.title}
        image={APP_ENV.IMAGES_400_URL + advert.images.find(img => img.priority === 0)?.name}
        price={advert.price}
        settlement={advert.settlementName}
        className={cardClassName}
      />
    )) || [], [adverts])


  return (
    <div className={`flex w-[100%] flex-col gap-[4vh] ${className}`}>
      <span className="font-unbounded font-medium text-adaptive-card-price-text">{title}</span>
      <ScrolledContainer>
        <div className="flex gap-[1vw]">
          {...advertsCards}
        </div>
      </ScrolledContainer>
    </div>
  )
}

export default ScrolledAdvertsSection