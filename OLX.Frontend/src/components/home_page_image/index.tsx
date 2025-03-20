import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../buttons/primary_button';
import './style.scss'
import { useAppSelector } from '../../redux';
const HomePageImageBlock: React.FC = () => {
    const navigate = useNavigate()
    const isAdmin = useAppSelector(state => state.user.auth.isAdmin)
    return (
        <div className="main-page-image h-[100vh] flex flex-col pl-40 justify-center">
            <div className='text-adaptive-button-main-page-text  text-white font-unbounded'>
                <h1>З нами речі</h1>
                <h1>отримують нове життя</h1>
            </div>
            <div className='flex gap-10 mt-20'>
                <PrimaryButton
                    title={'Купити зараз'}
                    className='text-adaptive-button-text w-[18vw]  h-[7vh]'
                    isLoading={false}
                    onButtonClick={() => navigate('/adverts')} />
                {!isAdmin &&
                    <PrimaryButton
                        className='border-2 text-adaptive-button-text  w-[18vw]  h-[7vh]'
                        bgColor='transparent'
                        fontColor='white'
                        title={'Додати оголошення'}
                        isLoading={false}
                        onButtonClick={() => navigate('/user/advert/create')} />
                }
            </div>
        </div>
    );
};

export default HomePageImageBlock;