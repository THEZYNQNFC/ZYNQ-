import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignupPage } from '../pages/public/SignupPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { PublicProfilePage } from '../pages/public/PublicProfilePage';
import { CardRedirectPage } from '../pages/public/CardRedirectPage';

// Customer Dashboard Pages
import { DashboardOverviewPage } from '../pages/dashboard/DashboardOverviewPage';
import { ProfileEditPage } from '../pages/dashboard/ProfileEditPage';
import { CustomizePage } from '../pages/dashboard/CustomizePage';
import { MyCardsPage } from '../pages/dashboard/MyCardsPage';
import { LeadsPage } from '../pages/dashboard/LeadsPage';
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage';
import { SettingsPage } from '../pages/dashboard/SettingsPage';

// Admin Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCardsPage } from '../pages/admin/AdminCardsPage';
import { AdminProfilesPage } from '../pages/admin/AdminProfilesPage';
import { AdminLeadsPage } from '../pages/admin/AdminLeadsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';

// Error Page
import { NotFoundPage } from '../components/error/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ==================================================================== */}
      {/* PUBLIC MARKETING & STANDALONE CARD ROUTES */}
      {/* ==================================================================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Standalone full-bleed mobile-first digital profile */}
      <Route path="/u/:username" element={<PublicProfilePage />} />

      {/* Standalone NFC hardware tap landing & resolution router */}
      <Route path="/c/:cardId" element={<CardRedirectPage />} />

      {/* ==================================================================== */}
      {/* AUTHENTICATION ROUTES */}
      {/* ==================================================================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ==================================================================== */}
      {/* PROTECTED CUSTOMER DASHBOARD ROUTES */}
      {/* ==================================================================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="profile" element={<ProfileEditPage />} />
        <Route path="customize" element={<CustomizePage />} />
        <Route path="cards" element={<MyCardsPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ==================================================================== */}
      {/* PROTECTED ADMIN ROUTES */}
      {/* ==================================================================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="cards" element={<AdminCardsPage />} />
        <Route path="profiles" element={<AdminProfilesPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* ==================================================================== */}
      {/* 404 CATCH-ALL */}
      {/* ==================================================================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
