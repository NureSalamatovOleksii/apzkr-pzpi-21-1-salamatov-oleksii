import { Home } from "../pages/Home";
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import ToggleElement from "../components/test";
import Profile from "../pages/Profile";
import Data from "../pages/Data";
import CollectionPoints from "../pages/CollectionPoints";
import PointDetails from "../pages/PointDetails";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/sign-up-form',
    element: <SignUp />
  },
  {
    path: '/log-in-form',
    element: <LogIn />
  },
  {
    path: '/test',
    element: <ToggleElement />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/data',
    element: <Data />
  },
  {
    path: '/collectionPoints',
    element: <CollectionPoints />
  },
  {
    path: '/pointDetails/:pointId',
    element: <PointDetails />
  }
];

export default AppRoutes;