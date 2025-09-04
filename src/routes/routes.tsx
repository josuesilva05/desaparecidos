import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import About from '../components/About';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

export { RouterProvider, router };