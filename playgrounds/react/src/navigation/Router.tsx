import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Layout} from "@/components/Layout.tsx";
import {IndexPage} from "@/pages/IndexPage/IndexPage.tsx";
import {InitDataPage} from "@/pages/InitDataPage.tsx";
import {LaunchParamsPage} from "@/pages/LaunchParamsPage.tsx";
import {ThemeParamsPage} from "@/pages/ThemeParamsPage.tsx";
import {ViewportParamsPage} from "@/pages/ViewportParamsPage.tsx";
import {TONConnectPage} from "@/pages/TONConnectPage/TONConnectPage.tsx";

export default function Router() {
  const router = createBrowserRouter([{
    path: "/",
    element: <Layout/>,
    children: [
      {index: true, element: <IndexPage/>},
      {path: "/init-data", element: <InitDataPage/>},
      {path: "/launch-params", element: <LaunchParamsPage/>},
      {path: "/theme-params", element: <ThemeParamsPage/>},
      {path: "/viewport-params", element: <ViewportParamsPage/>},
      {path: '/ton-connect', element: <TONConnectPage/>}
    ],
  }]);

  return <RouterProvider router={router}/>;
}