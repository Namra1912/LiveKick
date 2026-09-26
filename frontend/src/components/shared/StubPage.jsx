// src/components/shared/StubPage.jsx — Shared "coming soon" placeholder shell
import { motion } from 'framer-motion';
import { pageIn } from '../../lib/motion';
import '../../styles/StubPage.css';

export default function StubPage({ icon, heading, monoLine, children }) {
  return (
    <motion.main
      className="stub-page"
      initial="hidden"
      animate="show"
      variants={pageIn}
    >
      <div className="stub-page__panel">
        <div className="stub-page__icon">{icon}</div>
        <h1 className="stub-page__heading">{heading}</h1>
        {monoLine && <p className="stub-page__mono">{monoLine}</p>}
        {children}
        <span className="stub-page__badge">
          <span className="stub-page__badge-dot" />
          Coming soon
        </span>
      </div>
    </motion.main>
  );
}
