import { GetTermsConditionsAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import "./styles.css";
const TermsAndConditionsPage = () => {
  const { data: conditionsData } = useQuery({
    queryKey: ["GetTermsConditionsAPI"],
    queryFn: GetTermsConditionsAPI,
  });

  return (
    <div className="m-4">
      <div>
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: conditionsData?.data.conditions }}
        />
      </div>
    </div>
  );
};
export default TermsAndConditionsPage;
