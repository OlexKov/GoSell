import React, { useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form } from 'antd';
import { ILoginLocalRequest } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'react-toastify';
import { IError, IUserLockoutError } from '../../../models/еrrors';
import { useGoogleLoginMutation, useLoginMutation, useSendConfirmEmailMutation } from '../../../redux/api/accountApi';
import { BackButton } from '../../../components/buttons/back_button';
import FormInput from '../../../components/inputs/form_input';
import PrimaryButton from '../../../components/buttons/primary_button';
import { useAddToFavoritesMutation } from '../../../redux/api/accountAuthApi';
import { APP_ENV } from '../../../constants/env';

const loginAction: string = 'login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading: IsLoginLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [sendConfEmail, { isLoading: isConfirmEmailLoading }] = useSendConfirmEmailMutation();
  const [emailConfirmationError, setEmailConfirmationError] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginEmail = useRef<string | undefined>('')
  const remeber = useRef<boolean>(true)
  const [addToFavorites] = useAddToFavoritesMutation();

  const glLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(({ token: tokenResponse.access_token, remember: remeber.current }))
      if (!result.error) {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }
      else {
        loginEmail.current = ((result.error as IError).data as IUserLockoutError)?.Email || undefined;
        if ((result.error as IError).status === 403) {
          setEmailConfirmationError(true);
        }
      }
      const localFavorites: number[] = JSON.parse(localStorage.getItem(APP_ENV.FAVORITES_KEY) || "[]");
      if (localFavorites.length > 0) {
        Promise.all(localFavorites.map((id) => addToFavorites(id).unwrap()))
          .then(() => {
            localStorage.removeItem(APP_ENV.FAVORITES_KEY);
          })
          .catch((error) => console.error("Помилка при синхронізації обраного:", error));
      }
    }
  });

  const sendConfirmEmail = async () => {
    if (loginEmail.current) {
      const result = await sendConfEmail(loginEmail.current);
      if (!result.error) {
        setEmailConfirmationError(false)
        toast("Лист підтвердження відправлено на вашу пошту", {
          type: "success"
        })
      }
    }
    else {
      toast("Сталася помилка при відправці листа підтвердження", {
        type: "error"
      })
    }

  }

  const onFinish = async (loginModel: ILoginLocalRequest) => {
    setEmailConfirmationError(false);
    if (executeRecaptcha) {
      loginModel.recapthcaToken = await executeRecaptcha(loginAction);
      loginModel.action = loginAction
      const result = await login(loginModel);
      if (result.error) {
        loginEmail.current = ((result.error as IError)?.data as IUserLockoutError)?.Email || undefined;
        if ((result.error as IError).status === 403) {
          setEmailConfirmationError(true);
        }
      }
      else {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }

      const localFavorites: number[] = JSON.parse(localStorage.getItem(APP_ENV.FAVORITES_KEY) || "[]");
      if (localFavorites.length > 0) {
        Promise.all(localFavorites.map((id) => addToFavorites(id).unwrap()))
          .then(() => {
            localStorage.removeItem(APP_ENV.FAVORITES_KEY);
          })
          .catch((error) => console.error("Помилка при синхронізації обраного:", error));
      }
    }
  }

  return (
    <div id='#login' className="mx-auto my-auto flex flex-col items-center w-[50%] ">
      <BackButton
        title='На головну'
        path='/'
        className='mb-[50px] p-0 ml-[0px] self-start back-button'
      />
      <h2 className='text-[#3A211C] mb-[6vh] font-unbounded text-adaptive-login-header-text font-normal'>З поверненням!</h2>
      <Form
        layout='vertical'
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        className='w-full'
      >
        <FormInput
          className='h-[5vh] min-h-[35px] text-adaptive-input-form-text text-[#9B7A5B]'
          label='Електронна пошта'
          name='email'
          placeholder='example@gmail.com'
          rules={[
            { required: true, message: 'Будь ласка, введіть електронну пошту' },
            { type: 'email', message: 'Неправильний формат електронної пошти' }
          ]} />
        <FormInput
          className='h-[5vh] min-h-[35px] text-adaptive-input-form-text text-[#9B7A5B]'
          label='Пароль'
          name='password'
          placeholder='пароль'
          rules={[
            { required: true, message: 'Будь ласка, введіть пароль' }
          ]} />

        <div className='flex justify-between'>
          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox onChange={(event) => { remeber.current = event.target.checked }}>
              <span className='text-adaptive-input-form-error-text'>запам'ятати мене</span>
            </Checkbox>
          </Form.Item>

          <Button onClick={() => navigate('password')} className='text-[#3A211C] font-montserrat text-adaptive-input-form-error-text shadow-none border-none underline forget-password' variant="link">
            забули пароль?
          </Button>
        </div>

        <PrimaryButton
          title={!emailConfirmationError ? 'Увійти' : "Надіслати лист для підтвердження"}
          htmlType={!emailConfirmationError ? 'submit' : 'button'}
          onButtonClick={emailConfirmationError ? sendConfirmEmail : () => { }}
          isLoading={!emailConfirmationError ? IsLoginLoading : isConfirmEmailLoading}
          className='w-full h-[5vh]' />
        <Divider style={{ color: '#9B7A5B', fontSize: 'clamp(14px, 1.8vh, 36px)', fontWeight: '400' }}>або</Divider>
        <PrimaryButton className='w-full h-[5vh]' title='Увійти з Google' onButtonClick={glLogin} isLoading={isGoogleLoading} />

        <div className='flex justify-center text-adaptive-input-form-error-text items-center mt-[3vh]'>
          <p className='text-[#9B7A5B] font-montserrat'>Немає акаунту?</p>
          <Button onClick={() => navigate('register')} className='text-[#3A211C] text-adaptive-input-form-error-text shadow-none font-montserrat border-none forget-password ml-[5px]' variant="link">Зареєструватись тут</Button>
        </div>
      </Form>
      
    </div>
  )
}
export default LoginPage;