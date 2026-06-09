'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Handshake, Mail, MapPin, Phone, Send } from 'lucide-react';
import ConnectButton from '@/components/ui/ConnectButton';
import SocialsPopover from '@/components/contact/SocialsPopover';
import SupportStrip from '@/components/contact/SupportStrip';
import SiteFooter from '@/components/layout/SiteFooter';
import { contactInfo, formSubmit } from '@/data/contact';
import { personal } from '@/data/personal';

const contactIcons = { Email: Mail, Phone, Location: MapPin };

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch(formSubmit.url, {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else setError('Something went wrong. Email nishal@nishal.dev directly.');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <ConnectButton text="Connect" href="mailto:nishal@nishal.dev" icon={Handshake} />
            <ConnectButton text="Resume" href="/resume/view" icon={FileText} />
            <SocialsPopover />
          </div>
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
                  <a key={item.label} href={item.href} className="cursor-hover studio-contact-line">
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
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <p className="font-display text-2xl font-semibold text-[var(--text-soft)]">Message sent.</p>
                  <p className="mt-2 text-[var(--text-muted)]">I&apos;ll reply within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} action={formSubmit.url} method="POST" className="studio-form">
                  <input type="hidden" name="_subject" value={formSubmit.subject} />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_autoresponse" value={formSubmit.autoresponse} />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
                  {error ? <p className="text-sm text-red-400">{error}</p> : null}
                  <div className="studio-form-row">
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name"
                      className="studio-input"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      className="studio-input"
                    />
                  </div>
                  <input
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Subject"
                    className="studio-input"
                  />
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="studio-input studio-textarea"
                  />
                  <button type="submit" disabled={isSubmitting} className="cursor-hover studio-submit">
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
