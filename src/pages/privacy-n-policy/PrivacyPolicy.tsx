import { tl } from "../../translations/translation"; 
import { useLanguage } from "../../contexts/LanguageContext";

export function PrivacyPolicy() {
    const { currentLanguage } = useLanguage();
    
    return (
        <div className="min-h-screen flex justify-center items-start p-6 md:p-12 font-sans">
      <div className="max-w-3xl w-full shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{tl(currentLanguage, 'privacy.title')}</h1>

        <p className="mb-4">{tl(currentLanguage, 'privacy.intro')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.data_collected.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.data_collected.sso')}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{tl(currentLanguage, 'privacy.data_collected.sso.name')}</li>
          <li>{tl(currentLanguage, 'privacy.data_collected.sso.email')}</li>
        </ul>
        <p className="mb-4">{tl(currentLanguage, 'privacy.data_collected.usage')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.how_we_use.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.how_we_use.sso')}</p>
        <ul className="list-disc list-inside mb-4">
          <li>{tl(currentLanguage, 'privacy.how_we_use.sso.list1')}</li>
          <li>{tl(currentLanguage, 'privacy.how_we_use.sso.list2')}</li>
          <li>{tl(currentLanguage, 'privacy.how_we_use.sso.list3')}</li>
        </ul>
        <p className="mb-4">{tl(currentLanguage, 'privacy.how_we_use.usage')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.paid_features.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.paid_features.description1')}</p>
        <p className="mb-4">{tl(currentLanguage, 'privacy.paid_features.description2')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.data_security.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.data_security.description')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.your_rights.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.your_rights.description')}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.policy_updates.title')}</h2>
        <p className="mb-4">{tl(currentLanguage, 'privacy.policy_updates.description')}</p>
      </div>
    </div>
    );
};

export default PrivacyPolicy;
