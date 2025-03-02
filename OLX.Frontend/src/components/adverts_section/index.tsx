import { useMemo } from "react"
import AdvertCard from "../advert_card"
import { AdvertsSectionProps } from "./props"

const AdvertsSection: React.FC<AdvertsSectionProps> = ({ title, adverts, isLoading, className, columns = 3 }) => {

  const advertsCards = useMemo(() => adverts?.map(advert => (
    <AdvertCard
      key={advert.id}
      advert={advert} />
  )) || [], [adverts])

  return (
    <div >
      {title && <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal text-center'>{title}</h2>}

      <div className={`grid w-[100%] gap-y-[3vh] gap-x-[1vw] ${className}`}
         style={{ gridTemplateColumns: `repeat(${columns},minmax(0, 1fr))` }}>
        {isLoading ?
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500"></div>
          </div>
          :
           [...advertsCards ]
        }
      </div>
    </div>
  )
}

export default AdvertsSection