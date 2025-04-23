import { lazy } from "react";
import routePath from "../routePath";

const AboutPage = lazy(() => import("@/pages/public/about"));
const TermsAndConditionsPage = lazy(
  () => import("@/pages/public/terms-and-conditions"),
);

const DeleteGuestAcocuntPage = lazy(
  () => import("@/pages/public/guest/delete-account"),
);
const PrivacyPolicyPage = lazy(() => import("@/pages/public/privacy-policy"));

export const publicRoutes = [
  {
    path: "/",
    children: [
      // {
      //   path: routePath.aboutUs,
      //   element: <AboutPage />,
      // },

      {
        path: routePath.deleteGuestAccount,
        element: <DeleteGuestAcocuntPage />,
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
