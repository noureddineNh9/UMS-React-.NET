import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => (
  <>
    <Navbar />
    <div className="container mt-3">
      <Outlet />
    </div>
  </>

);

export default MainLayout;
