import Image from "next/image";

import { FooterNavigation } from "@/features/marketing/components/FooterNavigation";

export function MarketingFooter() {
  return (
    <footer className='marketing-footer overflow-hidden' data-navbar-theme='light'>
      <div className='container-wide'>
        <div className='footer-primary'>
          <FooterNavigation />
        </div>

        <div className='footer-meta'>
          <p className='footer-copyright'>
            © 2026 Drift.{" "}
            <a
              href='https://sarahaliriel.tech'
              target='_blank'
              rel='noopener noreferrer'
              className='footer-credit-link'
              aria-label='Design and development by Sarah Aliriel — visit portfolio'
            >
              <span className='footer-credit-prefix' aria-hidden='true'>
                design &amp; development by&nbsp;
              </span>
              <span className='footer-credit-signature' aria-hidden='true'>
                &lt;s/a&gt;
              </span>
              <span className='footer-credit-arrow' aria-hidden='true'>
                ↗
              </span>
            </a>
          </p>
          <div className='footer-brand'>
            <Image
              src='/logos/drift-logo-v2.png'
              alt='Drift'
              width={2000}
              height={2000}
              sizes='(min-width: 768px) 26rem, 16rem'
              className='footer-brand-image'
            />
          </div>
          <p className='footer-opensource'>Open source</p>
        </div>
      </div>
    </footer>
  );
}
