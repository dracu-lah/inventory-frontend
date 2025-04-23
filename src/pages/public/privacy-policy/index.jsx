import { GetPrivacyPolicyAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const PrivacyPolicyPage = () => {
  const { data: policyData } = useQuery({
    queryKey: ["GetPrivacyPolicyAPI"],
    queryFn: GetPrivacyPolicyAPI,
  });

  return (
    <div className="m-4 ">
      <div
        className="reset-tw"
        dangerouslySetInnerHTML={{ __html: policyData?.data.policy }}
      />
    </div>
  );
};
export default PrivacyPolicyPage;
