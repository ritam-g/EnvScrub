import { ThemeProvider } from './providers/ThemeProvider';
import { Header, Footer, Container } from '@/components/layout';
import {
  Hero,
  HowItWorks,
  BeforeAfter,
  TrustPrivacy,
  SupportedFormats,
  Faq,
} from '@/features/landing';
import { ScrubberTool } from '@/features/scrubber';

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
        {/* 1. Sticky Navigation Header */}
        <Header />

        <main className="flex-1">
          <Container size="lg">
            {/* 2. Hero Section */}
            <Hero />

            {/* 3. The Tool (Main Interactive Feature) */}
            <section aria-label="EnvScrub Tool" className="pb-16 sm:pb-20">
              <ScrubberTool />
            </section>
          </Container>

          {/* 4. How It Works */}
          <HowItWorks />

          {/* 5. Before & After Static Showcase */}
          <BeforeAfter />

          {/* 6. Why You Can Trust It & Privacy Guarantees */}
          <TrustPrivacy />

          {/* 7. Supported Formats Grid */}
          <SupportedFormats />

          {/* 8. FAQ */}
          <Faq />
        </main>

        {/* 9. Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
