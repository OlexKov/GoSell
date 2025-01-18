import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import './App.scss'
import DefaultLayout from './components/layouts/default_layout/index';
import ProtectedRoutes from './components/protected_routes';
import GlobalFallback from './components/global_fallback';

const ErrorPage = React.lazy(() => import('./pages/default/errors/error_page'));
const ReCaptcha = React.lazy(() => import('./components/google_recaptca'));
const AdminCreate = React.lazy(() => import('./pages/admin/admins/new_admin'));
const AdminsTable = React.lazy(() => import('./pages/admin/admins/admins_table'));
const AdminFilterTable = React.lazy(() => import('./pages/admin/filters/filter_table'));
const AdminFilterEdit = React.lazy(() => import('./pages/admin/filters/filter_edit'));
const AdminFilterCreate = React.lazy(() => import('./pages/admin/filters/filter_create'));
const AdminCategoryEdit = React.lazy(() => import('./pages/admin/categories/category_edit'));
const AdminCategoryCreate = React.lazy(() => import('./pages/admin/categories/category_create'));
const AdminCategoryTable = React.lazy(() => import('./pages/admin/categories/category_table'));
const AdminApproveAdvertTable = React.lazy(() => import('./pages/admin/adverts/not_approved'));
const AdminAdvertTable = React.lazy(() => import('./pages/admin/adverts/adverts_table'));
const ForgotPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_forgot'));
const ResetPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_reset'));
const EmailConfirmationPage = React.lazy(() => import('./pages/default/email_confirmation'));
const UsersPage = React.lazy(() => import('./pages/admin/users/all_users/index'));
const BlockedUsersPage = React.lazy(() => import('./pages/admin/users/blocked_users/index'));
const AdminLayout = React.lazy(() => import('./components/layouts/admin_layout/index'));
const HomePage = React.lazy(() => import('./pages/default/home'));
const NotFoundPage = React.lazy(() => import('./pages/default/errors/not_found_page'))
const LoginPage = React.lazy(() => import('./pages/default/login/index'));
const RegisterPage = React.lazy(() => import('./pages/default/register'));

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes requiredRole={["User", "UnAuth"]} />}>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="error" element={<ErrorPage />} />

          <Route path="auth">
            <Route index element={<ReCaptcha><LoginPage /></ReCaptcha>} />
            <Route path="register" element={<ReCaptcha ><RegisterPage /></ReCaptcha>} />
            <Route path="emailconfirm" element={<EmailConfirmationPage />} />
            <Route path="password">
              <Route index element={<ForgotPasswordPage />} />
              <Route path="reset" element={<ResetPasswordPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoutes requiredRole={"User"} />}>
            <Route path="user">
              <Route path="userprofile" element={<HomePage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoutes requiredRole={"Admin"} />}>
        <Route path="/admin" element={
          <Suspense fallback={<GlobalFallback />}>
            <AdminLayout />
          </Suspense>}>
          <Route index element={<UsersPage />} />
          <Route path="blocked" element={<BlockedUsersPage />} />

          <Route path="adverts">
            <Route index element={<AdminAdvertTable />} />
            <Route path='approve' element={<AdminApproveAdvertTable />} />
          </Route>

          <Route path="categories">
            <Route index element={<AdminCategoryTable />} />
            <Route path='new' element={<AdminCategoryCreate />} />
            <Route path='edit' element={<AdminCategoryEdit />} />
          </Route>

          <Route path="filters">
            <Route index element={<AdminFilterTable />} />
            <Route path='new' element={<AdminFilterCreate />} />
            <Route path='edit' element={<AdminFilterEdit />} />
          </Route>

          <Route path="admins">
            <Route index element={<AdminsTable />} />
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
