import { lazy } from "react";
import routePath from "../routePath";

const AboutPage = lazy(() => import("@/pages/public/about"));
const TermsAndConditionsPage = lazy(
  () => import("@/pages/public/terms-and-conditions"),
);

const PrivacyPolicyPage = lazy(() => import("@/pages/public/privacy-policy"));

export const publicRoutes = [
  {
    path: "/",
    children: [
      {
        path: routePath.aboutUs,
        element: <AboutPage />,
      },
      {
        path: routePath.termsAndConditions,
        element: <TermsAndConditionsPage />,
      },
      {
        path: routePath.privacyPolicy,
        element: <PrivacyPolicyPage />,
      },
    ],
  },
];
