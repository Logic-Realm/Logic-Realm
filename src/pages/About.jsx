import './css/About.css';
import SEO from '../component/SEO/SEO.jsx';
import { motion as Motion } from 'motion/react';
import ScrollCard from '../component/ScrollCard/ScrollCard.jsx';
import SoftDev from '../assets/hero-software-dev.svg';

const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ZapIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const GemIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="m12 22 4-13-3-6" />
        <path d="M12 22 8 9l3-6" />
    </svg>
);

const ValueCard = ({ icon, title, description, direction }) => (
    <ScrollCard className="values-card" direction={direction} scroll={0.4}>
        <div className="icon-wrapper">
            {icon}
        </div>
        <div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </ScrollCard>
);

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
};

const imageReveal = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1, ease: "easeOut" }
    }
};

export default function About() {
    return (
        <div className="about-page">
            <SEO
                name="About Logic Realm - Our Approach to Software"
                oname="About Logic Realm"
                description="Discover Logic Realm, an emerging software initiative focused on building useful digital products and thoughtful software solutions."
                route="/about"
                image="/seo/about_page.png"
            />
            <section className="about-hero">
                <Motion.div
                    className="about-container"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <Motion.h1 variants={fadeInUp}>Building with <span>Purpose</span>.</Motion.h1>
                    <Motion.p variants={fadeInUp}>Logic Realm is an emerging software initiative focused on crafting intelligent, efficient, and scalable software solutions that empower innovation and reliability.</Motion.p>
                </Motion.div>
            </section>

            <section className="about-story">
                <div className="about-story-container">
                    <div className="grid">
                        <Motion.div
                            className="prose"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>What We're Building</h2>
                            <p>Logic Realm is at an early stage. We're building its foundations, developing digital products, and shaping a clear approach to creating useful software.</p>
                            <p>Our focus is on solving practical problems through thoughtful engineering, reliable experiences, and purposeful design. We don't claim a long history or a record we haven't earned. Instead, we're focused on learning, improving, and making each release better than the last.</p>
                        </Motion.div>
                        <Motion.div
                            className="ab-relative"
                            variants={imageReveal}
                            initial="hidden"
                            whileInView="visible"
                        >
                            <img src={SoftDev} alt="Illustration representing software development at Logic Realm" loading="lazy" />
                            <div className="ab-absolute"></div>
                        </Motion.div>
                    </div>
                </div>
            </section>

            <section className="value-section">
                <div className="value-container">
                    <Motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Principles Behind the Work
                    </Motion.h2>
                    <Motion.p
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{ delay: 0.4 }}
                    >
                        The principles guiding how Logic Realm approaches products, decisions, and future growth.
                    </Motion.p>
                    <div className="values-grid">
                        <ValueCard
                            icon={<ZapIcon className="w-8 h-8" />}
                            title="Purposeful Innovation"
                            description="Explore new ideas when they make a product more useful, capable, or reliable."
                            direction="left"
                        />
                        <ValueCard
                            icon={<UsersIcon className="w-8 h-8" />}
                            title="People First"
                            description="Keep real user needs at the centre of product decisions and experiences."
                            direction="left"
                        />
                        <ValueCard
                            icon={<GemIcon className="w-8 h-8" />}
                            title="Quality Matters"
                            description="Pay attention to the details that make software dependable, clear, and enjoyable to use."
                            direction="left"
                        />
                        <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" /></svg>}
                            title="Transparency"
                            description="Communicate clearly and represent products, capabilities, and progress honestly."
                            direction="right"
                        />
                        <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>}
                            title="Ownership"
                            description="Take responsibility for decisions, details, and the quality of every release."
                            direction="right"
                        />
                        <ValueCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>}
                            title="Continuous Learning"
                            description="Treat every challenge, release, and piece of feedback as an opportunity to improve."
                            direction="right"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
