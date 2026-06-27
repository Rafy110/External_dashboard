import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ProjectDashboard from './pages/ProjectDashboard';

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/project/:projectId" element={<ProjectDashboard />} />
      </Routes>
    </div>
  );
}