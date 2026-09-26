import { MotionConfig } from 'framer-motion';
import AppRouter from './routes/AppRouter';

export default function App() {
  // reducedMotion="user" makes every Framer Motion animation in the app respect
  // prefers-reduced-motion automatically — no per-component check needed.
  return (
    <MotionConfig reducedMotion="user">
      <AppRouter />
    </MotionConfig>
  );
}
