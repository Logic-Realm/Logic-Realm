import './css/AppLandingPage.css';
import Box from '@mui/material/Box';
import SEO from '../component/SEO/SEO.jsx';
import { API_BASE_URL } from '../config/api.js'
import { motion as Motion } from 'motion/react';
import IconButton from '@mui/material/IconButton';
import { Link, useParams } from 'react-router-dom';
import Info from '../component/LandingPage/Info/Info.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState, Suspense, lazy } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../component/LandingPage/Header/Header.jsx';
import Download from '../component/LandingPage/Download/Download.jsx';
import ErrorPage from './404.jsx';
// import Screenshots from '../component/LandingPage/SS/Screenshots.jsx';
import Description from '../component/LandingPage/Description/Description.jsx';

const SimilarApps = lazy(() => import('../component/LandingPage/SimilarApps/SimilarApps.jsx'));

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const AppLandingPage = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [appDetails, setAppDetails] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let isActive = true;

        const getAppData = async () => {
            setLoading(true);
            setNotFound(false);
            setAppDetails(null);

            try {
                const response = await fetch(`${API_BASE_URL}api/routes/getAppDetails.php`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ slug })
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();
                const app = data?.response_data;

                if (!app || typeof app !== 'object' || Array.isArray(app) || Number(data?.response_code) !== 200) {
                    if (isActive) {
                        setNotFound(true);
                        setLoading(false);
                    }
                    return;
                }

                if (isActive) {
                    setAppDetails(app);
                    setLoading(false);

                    try {
                        const existing = JSON.parse(localStorage.getItem("allSoftwares") || "{}");
                        existing[slug] = app;
                        localStorage.setItem("allSoftwares", JSON.stringify(existing));
                    } catch (cacheError) {
                        console.warn('Could not cache software details:', cacheError);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch app details:', err);
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        getAppData();

        return () => {
            isActive = false;
        };
    }, [slug]);

    if (notFound) {
        return <ErrorPage />;
    }

    if (loading) {
        return (
            <div className="app-landing-page">
                <CircularProgress />
            </div>
        );
    }

    if (!appDetails) {
        return (
            <div className="app-landing-page">
                <SEO
                    name="Unable to Load Software | Logic Realm"
                    description="Software details could not be loaded. Please try again."
                    noindex={true}
                />
                <p role="alert">Unable to load this software right now. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="app-landing-page">
            <SEO
                name={`${appDetails.name} - ${appDetails.sdesc || 'Software'} | Logic Realm`}
                oname={`${appDetails.name} by Logic Realm`}
                route={`/softwares/${slug}`}
                description={appDetails.sdesc || 'Explore software products developed by Logic Realm.'}
                image={`/seo/${slug}_page.png`}
                key={slug}
            />
            <Link to='/softwares' className='backBtn'>
                <IconButton
                    aria-label="Go Back"
                    title='Go Back'
                    style={{
                        position: "fixed",
                        top: "6rem",
                        left: "2rem",
                        background: "#6E89FF",
                        color: "white"
                    }}>
                    <ArrowBackIcon />
                </IconButton>
            </Link>

            <Motion.div
                className='app-landing-container'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
            >
                <Header
                    img={appDetails.img}
                    name={appDetails.name}
                    desc={appDetails.sdesc}
                    variants={itemVariants}
                />
                <div className="app-landing-grid">
                    <div className="aplan-con">
                        <Description
                            descP={appDetails.descP}
                            descS={appDetails.descS}
                            features={appDetails.features}
                            steps={appDetails.steps}
                            variants={itemVariants}
                        />
                        {/* <Screenshots /> */}
                    </div>
                    <div className="aplan-con-2">
                        <Download
                            platforms={appDetails.platforms}
                            dlink={appDetails.dlink}
                            vers={appDetails.vers}
                            github={appDetails.github}
                            variants={itemVariants}
                        />
                        <Info
                            size={appDetails.size}
                            platforms={appDetails.platforms}
                            category={appDetails.category}
                            variants={itemVariants}
                        />
                    </div>
                </div>
                <Suspense
                    fallback={
                        <Box sx={{ width: '100%', height: '1rem', marginTop: '2rem' }}>
                            <LinearProgress color='info' style={{ height: '0.75rem' }} />
                        </Box>
                    }>
                    <SimilarApps slug={slug} />
                </Suspense>
            </Motion.div>
        </div>
    )
}

export default AppLandingPage