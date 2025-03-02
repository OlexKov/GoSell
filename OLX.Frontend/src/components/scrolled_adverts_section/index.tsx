import { useMemo } from "react"
import AdvertCard from "../advert_card"
import ScrolledContainer from "../scrolled_container"
import { IScrolledAdvertsSectionProps } from "./props"

const ScrolledAdvertsSection: React.FC<IScrolledAdvertsSectionProps> = ({ title, adverts,  className ,cardClassName}) => {

  const advertsCards = useMemo(() => adverts
    .map((advert) => (
      <AdvertCard
        key={advert.id}
        advert={advert}
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