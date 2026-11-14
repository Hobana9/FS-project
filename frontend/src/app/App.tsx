import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.tsx';
import UploadsPage from './pages/UploadsPage.tsx';
import NewUploadPage from './pages/NewUploadPage.tsx';
import DefectsPage from './pages/DefectsPage.tsx';
import TasksPage from './pages/TasksPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/uploads" replace />} />
        <Route path="uploads" element={<UploadsPage />} />
        <Route path="uploads/new" element={<NewUploadPage />} />
        <Route path="defects" element={<DefectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
