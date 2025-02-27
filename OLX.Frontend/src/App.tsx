import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import './App.scss'
import DefaultLayout from './components/layouts/default_layout/index';
import ProtectedRoutes from './components/protected_routes';
import GlobalFallback from './components/global_fallback';


const PaymentPage = React.lazy(() => import('./pages/user/payment'));
const AdminMessagesPage = React.lazy(() => import( './pages/user/admin_messages'));
const FavoritesAdverts = React.lazy(() => import('./pages/user/favorites_adverts'));
const BuyAdvertPage = React.lazy(() => import('./pages/user/buy'));
const CreateAdvert = React.lazy(() => import('./pages/user/create_advert'));
const UserProfile = React.lazy(() => import('./pages/user/profile'));
const UserProfileEdit = React.lazy(() => import('./pages/user/edit_profile'));
const AdvertsPage = React.lazy(() => import('./pages/default/adverts'));
const AdminAdvertPreview = React.lazy(() => import('./pages/admin/adverts/advert_preview'));
const AdvertPage = React.lazy(() => import('./pages/default/advert'));
const AuthLayout = React.lazy(() => import('./components/layouts/auth_layout'));
const PasswordChangeConfirmPage = React.lazy(() => import('./pages/default/restore_password/email_sended'));
const RegisterConfirmPage = React.lazy(() => import('./pages/default/register/register_confirm'));
const ErrorPage = React.lazy(() => import('./pages/default/errors/error_page'));
const ReCaptcha = React.lazy(() => import('./components/google_recaptca'));
const AdminCreate = React.lazy(() => import('./pages/admin/admins/new_admin'));
const AdminFilterTable = React.lazy(() => import('./pages/admin/filters/filter_table'));
const AdminCategoryTable = React.lazy(() => import('./pages/admin/categories/category_table'));
const AdminAdvertTable = React.lazy(() => import('./pages/admin/adverts/adverts_table'));
const ForgotPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_forgot'));
const ResetPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_reset'));
const EmailConfirmationPage = React.lazy(() => import('./pages/default/email_confirmation'));
const UsersPage = React.lazy(() => import('./pages/admin/users/all_users/index'));
const AdminLayout = React.lazy(() => import('./components/layouts/admin_layout/index'));
const HomePage = React.lazy(() => import('./pages/default/home'));
const NotFoundPage = React.lazy(() => import('./pages/default/errors/not_found_page'))
const LoginPage = React.lazy(() => import('./pages/default/login/index'));
const RegisterPage = React.lazy(() => import('./pages/default/register'));

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes requiredRole={["User", "UnAuth"]} />}>
        <Route path="/" element={
          <Suspense fallback={<GlobalFallback />}>
            <DefaultLayout />
          </Suspense>
        }>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="error" element={<ErrorPage />} />
          <Route path="advert/:id" element={<AdvertPage />} />
          <Route path="adverts" element={<AdvertsPage />} />

          <Route element={<ProtectedRoutes requiredRole={"User"} />}>
            <Route path="user">
              <Route index element={<UserProfile />} />
              <Route path='edit' element={<UserProfileEdit />} />
              <Route path='advert/create' element={<CreateAdvert />} />
              <Route path='advert/edit/:id' element={<CreateAdvert />} />
              <Route path='favorites' element={<FavoritesAdverts />} />
              <Route path='advert/buy/:id' element={<BuyAdvertPage />} />
              <Route path='advert/payment/:id' element={<PaymentPage />} />
              <Route path='messages' element={<AdminMessagesPage />} />
            </Route>
          </Route>

        </Route>
      </Route>

      <Route path="/auth" element={
        <Suspense fallback={<GlobalFallback />}>
          <AuthLayout />
        </Suspense>
      }>
        <Route index element={<ReCaptcha><LoginPage /></ReCaptcha>} />

        <Route path="register">
          <Route index element={<ReCaptcha><RegisterPage /></ReCaptcha>} />
          <Route path="confirm" element={<RegisterConfirmPage />} />
          <Route path="emailconfirm" element={<EmailConfirmationPage />} />
        </Route>

        <Route path="password">
          <Route index element={<ForgotPasswordPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="passwordconfirm" element={<PasswordChangeConfirmPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoutes requiredRole={"Admin"} />}>
        <Route path="/admin" element={
          <Suspense fallback={<GlobalFallback />}>
            <AdminLayout />
          </Suspense>}>
          <Route index element={<UsersPage />} />

          <Route path="adverts">
            <Route index element={<AdminAdvertTable />} />
            <Route path='approve' element={<AdminAdvertTable />} />
            <Route path='preview/:id' element={<AdminAdvertPreview />} />
            <Route path="blocked" element={<UsersPage />} />
          </Route>

          <Route path="categories">
            <Route index element={<AdminCategoryTable />} />
          </Route>

          <Route path="filters">
            <Route index element={<AdminFilterTable />} />
          </Route>

          <Route path="admins">
            <Route index element={<UsersPage />} />
            <Route path='new' element={<AdminCreate />} />
          </Route>

          <Route path="error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
