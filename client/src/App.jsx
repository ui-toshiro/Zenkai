import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import UpcomingMoviesPage from './pages/UpcomingMoviesPage';
import CityTicketFinderPage from './pages/CityTicketFinderPage';
import MusicEventsPage from './pages/MusicEventsPage';
import MusicEventDetailsPage from './pages/MusicEventDetailsPage';
import ArtistsListPage from './pages/ArtistsListPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
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
            </main>
            <Footer />
          </div>
        </Router>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
