import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const UpcomingMoviesPage = lazy(() => import('./pages/UpcomingMoviesPage'));
const CityTicketFinderPage = lazy(() => import('./pages/CityTicketFinderPage'));
const MusicEventsPage = lazy(() => import('./pages/MusicEventsPage'));
const MusicEventDetailsPage = lazy(() => import('./pages/MusicEventDetailsPage'));
const ArtistsListPage = lazy(() => import('./pages/ArtistsListPage'));
const ArtistProfilePage = lazy(() => import('./pages/ArtistProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/upcoming" element={<UpcomingMoviesPage />} />
                  <Route path="/movie/:idOrSlug" element={<MovieDetailsPage />} />
                  <Route path="/tickets" element={<CityTicketFinderPage />} />
                  <Route path="/music" element={<MusicEventsPage />} />
                  <Route path="/music/:idOrSlug" element={<MusicEventDetailsPage />} />
                  <Route path="/artists" element={<ArtistsListPage />} />
                  <Route path="/artist/:idOrSlug" element={<ArtistProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
