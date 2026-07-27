export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

/** Soft ease-out — fewer harsh stops on section reveals */
export const defaultTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};
