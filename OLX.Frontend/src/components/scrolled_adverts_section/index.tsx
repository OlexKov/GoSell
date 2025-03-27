import { useMemo } from "react"
import AdvertCard from "../advert_card"
import ScrolledContainer from "../scrolled_container"
import { IScrolledAdvertsSectionProps } from "./props"


const ScrolledAdvertsSection: React.FC<IScrolledAdvertsSectionProps> = ({ title, adverts, className, cardClassName }) => {

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
      <div className="flex gap-[2vw] items-center">
        <span className="font-unbounded font-medium text-adaptive-card-price-text">{title}</span>
        {advertsCards.length > 4 &&
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[1.5vw]" viewBox="0 0 24 24" fill="none">
            <path d="M15 5L13.59 6.41L18.17 11H2V13H18.17L13.58 17.59L15 19L22 12L15 5Z" fill="gray" />
          </svg>
        }

      </div>

      <ScrolledContainer>
        <div className="flex gap-[1vw]">
          {...advertsCards}
        </div>
      </ScrolledContainer>
    </div>
  )
}

export default ScrolledAdvertsSection