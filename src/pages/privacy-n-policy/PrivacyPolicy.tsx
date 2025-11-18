import { Helmet } from "react-helmet-async";

import { languages, tl } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { currentLanguage } = useLanguage();
  const currentPagePath = "privacypolicy";

  return (
    <>
      <Helmet>
        {currentLanguage.id === "pt-br" ? (
          <>
            <title>Política de Privacidade - WatchIT</title>
            <meta
              name="description"
              content="Leia a Política de Privacidade da WatchIT e saiba como coletamos, usamos e protegemos suas informações."/>
            <meta property="og:title" content="Política de Privacidade - WatchIT" />
            <meta
              property="og:description"
              content="Leia a Política de Privacidade da WatchIT e saiba como coletamos, usamos e protegemos suas informações."/>
            <meta property="og:locale" content="pt_BR" />
          </>
        ) : (
          <>
            <title>Privacy Policy - WatchIT</title>
            <meta
              name="description"
              content="Read WatchIT’s Privacy Policy and learn how we collect, use, and protect your information."/>
            <meta property="og:title" content="Privacy Policy - WatchIT" />
            <meta
              property="og:description"
              content="Read WatchIT’s Privacy Policy and learn how we collect, use, and protect your information."/>
            <meta property="og:locale" content="en_US" />
          </>
        )}
        {(() => {
          const normalizedPath = currentPagePath.startsWith("/")
            ? currentPagePath.slice(1)
            : currentPagePath;
          const canonicalUrl = `https://watchit.gg/${currentLanguage.id}/${normalizedPath}`;
          const xDefaultUrl = `https://watchit.gg/pt-br/${normalizedPath}`;
          return (
            <>
              <link rel="canonical" href={canonicalUrl} />

              {languages.map((lang) => (
                <link
                  key={`hreflang-${lang.id}`}
                  rel="alternate"
                  href={`https://watchit.gg/${lang.id.toLowerCase()}/${normalizedPath}`}
                  hrefLang={lang.id.toLowerCase()}/>
              ))}
              <link
                rel="alternate"
                href={`${xDefaultUrl}`}
                hrefLang="x-default"/>
              <meta property="og:url" content={canonicalUrl} />
            </>
          );
        })()}
        <meta property="og:image" content="https://watchit.gg/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="min-h-screen flex justify-center items-start p-6 md:p-12">
        <div className="max-w-3xl w-full shadow-lg p-8 mb-24 bg-white text-black">
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
          <p className="mb-4">{tl(currentLanguage, 'privacy.your_rights.description')}
            <a href="mailto:support@watchit.gg"
              className="text-blue-600 underline">
              support@watchit.gg
            </a>.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">{tl(currentLanguage, 'privacy.policy_updates.title')}</h2>
          <p className="mb-4">{tl(currentLanguage, 'privacy.policy_updates.description')}</p>
        </div>
      </div>
    </>

  );
};
