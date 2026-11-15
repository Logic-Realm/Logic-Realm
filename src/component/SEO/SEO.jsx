import { Helmet } from 'react-helmet-async';

const SITE_URL = "https://logicrealm.rf.gd";

const SEO = ({
    name = "Logic Realm - Modern Web & Mobile Software Solutions",
    oname = "",
    description = "Logic Realm designs and develops web applications, mobile apps, and custom software solutions.",
    route = "/",
    type = "website",
    image = "/seo/home_page.png",
    noindex = false,
}) => {
    const title = name || "Logic Realm";
    const ogTitle = oname || title;
    const canonicalUrl = `${SITE_URL}${route.startsWith("/") ? route : `/${route}`}`;
    const imageUrl = /^https?:\/\//i.test(image)
        ? image
        : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {!noindex && <link rel="canonical" href={canonicalUrl} />}
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            <meta property="og:site_name" content="Logic Realm" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content={type} />
            {!noindex && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={ogTitle} />

            <meta name="twitter:card" content="summary_large_image" />
            {!noindex && <meta name="twitter:url" content={canonicalUrl} />}
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Helmet>
    );
};

export default SEO;
