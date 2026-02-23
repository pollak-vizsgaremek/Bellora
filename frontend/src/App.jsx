import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import NewItem from './pages/NewItem';
import EditItem from './pages/EditItem';
import MyItems from './pages/MyItems';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <AlertProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/item/:id/edit" element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              } />
              <Route path="/new-item" element={
                <ProtectedRoute>
                  <NewItem />
                </ProtectedRoute>
              } />
              <Route path="/my-items" element={
                <ProtectedRoute>
                  <MyItems />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/messages/:userId" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/user/:userId" element={<PublicProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AlertProvider>
    </div>
  );
}

export default App;
