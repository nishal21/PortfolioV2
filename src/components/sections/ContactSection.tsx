'use client';

import { FileText, Handshake, Mail, MapPin, Phone } from 'lucide-react';
import ConnectButton from '@/components/ui/ConnectButton';
import ContactSendForm from '@/components/contact/ContactSendForm';
import ContactSocialRow from '@/components/contact/ContactSocialRow';
import SupportStrip from '@/components/contact/SupportStrip';
import SiteFooter from '@/components/layout/SiteFooter';
import { contactInfo, contactMail } from '@/data/contact';
import { personal } from '@/data/personal';

const contactIcons = { Email: Mail, Phone, Location: MapPin };

export default function ContactSection() {
  return (
    <>
      <section id="contact" className="studio-contact">
        <div className="studio-contact-hero">
          <p className="studio-contact-name font-malayalam">{personal.malayalamName}</p>
          <h2 className="studio-contact-headline">
            <span className="studio-contact-headline-role">
              AMV editor, music producer, developer.
            </span>
            <span className="studio-contact-headline-cta">Let&apos;s work on something.</span>
          </h2>
          <div className="studio-contact-actions">
            <ConnectButton text="Connect" href={`mailto:${contactMail.address}`} icon={Handshake} />
            <ConnectButton text="Resume" href="/resume/view" icon={FileText} />
          </div>
          <ContactSocialRow />
        </div>

        <div className="studio-contact-body page-container">
          <div className="studio-contact-grid">
            <div className="studio-contact-details">
              <p className="studio-label">Contact</p>
              <h3 className="studio-contact-subtitle">Get in Touch</h3>
              <p className="studio-contact-lead">
                Open to collabs, freelance gigs, and weird creative ideas.
              </p>
              {contactInfo.map((item) => {
                const Icon = contactIcons[item.label as keyof typeof contactIcons] ?? Mail;
                return (
                  <a key={item.label} href={item.href} className="hit-target studio-contact-line">
                    <Icon className="h-4 w-4 shrink-0 text-[var(--studio-accent)]" />
                    <div>
                      <span className="studio-contact-label">{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  </a>
                );
              })}

              <SupportStrip />
            </div>

            <div className="studio-contact-form">
              <ContactSendForm />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
