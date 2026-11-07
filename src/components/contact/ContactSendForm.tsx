'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { contactMail, formSubmit } from '@/data/contact';
import './contact-send.css';

type Phase = 'idle' | 'packing' | 'done' | 'error';
type StepState = '' | 'cur' | 'done' | 'err';

const STEPS = [
  'Message packed',
  'Envelope sealed',
  'Sent to Nishal',
  'Confirmation on its way',
] as const;

const EASE = 'cubic-bezier(.45,.05,.25,1)';
const FLY_EASE = 'cubic-bezier(.22,.7,.28,1)';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function motionScale() {
  return prefersReducedMotion() ? 0 : 1;
}

function sleep(ms: number) {
  const k = motionScale();
  if (k === 0) return Promise.resolve();
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function animate(
  el: Element,
  keyframes: Keyframe[],
  duration: number,
  options: KeyframeAnimationOptions = {}
) {
  const k = motionScale();
  if (k === 0) {
    const last = keyframes[keyframes.length - 1];
    if (last && el instanceof HTMLElement) {
      if (typeof last.opacity === 'number') el.style.opacity = String(last.opacity);
      if (typeof last.transform === 'string') el.style.transform = last.transform;
    }
    return Promise.resolve();
  }
  return el
    .animate(keyframes, {
      duration: duration * k,
      fill: 'forwards',
      easing: EASE,
      ...options,
    })
    .finished.catch(() => undefined);
}

export default function ContactSendForm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<HTMLDivElement>(null);
  const bobRef = useRef<Animation | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [steps, setSteps] = useState<StepState[]>(['', '', '', '']);
  const [fieldErrors, setFieldErrors] = useState({ name: false, email: false, message: false });
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');
  const [doneName, setDoneName] = useState('friend');
  const payloadRef = useRef(formData);

  useEffect(() => {
    payloadRef.current = formData;
  }, [formData]);

  const setStep = useCallback((index: number, state: StepState) => {
    setSteps((prev) => {
      const next = [...prev] as StepState[];
      next[index] = state;
      return next;
    });
  }, []);

  const cancelSceneAnims = useCallback(() => {
    bobRef.current?.cancel();
    bobRef.current = null;
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll('.contact-send__stage *').forEach((node) => {
      node.getAnimations().forEach((a) => a.cancel());
    });
  }, []);

  const resetSceneStyles = useCallback(() => {
    const nodes = [
      envRef.current,
      letterRef.current,
      p1Ref.current,
      p3Ref.current,
      flapRef.current,
      sealRef.current,
      wakeRef.current,
    ];
    nodes.forEach((el) => {
      if (!el) return;
      el.style.opacity = '';
      el.style.transform = '';
      el.style.zIndex = '';
    });
    envRef.current?.querySelectorAll('.contact-send__sp').forEach((sp) => {
      (sp as HTMLElement).style.opacity = '';
    });
  }, []);

  const resetToForm = useCallback(() => {
    cancelSceneAnims();
    resetSceneStyles();
    setPhase('idle');
    setSteps(['', '', '', '']);
    setError('');
  }, [cancelSceneAnims, resetSceneStyles]);

  const pack = useCallback(async () => {
    const env = envRef.current;
    const letter = letterRef.current;
    const p1 = p1Ref.current;
    const p3 = p3Ref.current;
    const flap = flapRef.current;
    const seal = sealRef.current;
    if (!env || !letter || !p1 || !p3 || !flap || !seal) return;

    setStep(0, 'cur');
    await Promise.all([
      animate(env, [{ opacity: 0, transform: 'translateY(28px) scale(.9)' }, { opacity: 1, transform: 'none' }], 480),
      animate(letter, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], 480),
    ]);
    await sleep(220);
    await Promise.all([
      animate(p1, [{ transform: 'rotateX(0)' }, { transform: 'rotateX(180deg)' }], 580),
      animate(p3, [{ transform: 'rotateX(0)' }, { transform: 'rotateX(-180deg)' }], 580, {
        delay: 280 * motionScale(),
      }),
    ]);
    setStep(0, 'done');
    await sleep(120);
    await animate(letter, [{ transform: 'translateY(0)' }, { transform: 'translateY(13rem)' }], 720);
    setStep(1, 'cur');
    await animate(
      flap,
      [
        { transform: 'rotateX(180deg)', zIndex: 1 },
        { transform: 'rotateX(0deg)', zIndex: 4 },
      ],
      560
    );
    await animate(
      seal,
      [
        { opacity: 0, transform: 'scale(.15)' },
        { opacity: 1, transform: 'scale(1.18)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      420
    );
    setStep(1, 'done');
  }, [setStep]);

  const flyAway = useCallback(async () => {
    const env = envRef.current;
    const wake = wakeRef.current;
    if (!env) return;

    if (wake) {
      await animate(wake, [{ opacity: 0 }, { opacity: 1 }], 160);
    }

    env.querySelectorAll('.contact-send__sp').forEach((sp, i) => {
      void animate(
        sp,
        [{ opacity: 0, transform: 'translateX(0)' }, { opacity: 0.95, transform: 'translateX(-8px)', offset: 0.35 }, { opacity: 0, transform: 'translateX(-22px)' }],
        900,
        { delay: i * 70 * motionScale() }
      );
    });

    await animate(
      env,
      [
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1, offset: 0 },
        { transform: 'translate(-10px,-36px) rotate(-10deg) scale(1.04)', opacity: 1, offset: 0.14 },
        { transform: 'translate(18vw,-28vh) rotate(4deg) scale(.92)', opacity: 1, offset: 0.38 },
        { transform: 'translate(48vw,-55vh) rotate(14deg) scale(.62)', opacity: 0.85, offset: 0.68 },
        { transform: 'translate(78vw,-88vh) rotate(26deg) scale(.28)', opacity: 0, offset: 1 },
      ],
      1350,
      { easing: FLY_EASE }
    );

    if (wake) {
      void animate(wake, [{ opacity: 1 }, { opacity: 0 }], 200);
    }
  }, []);

  const postMessage = useCallback(async () => {
    const form = formRef.current;
    if (!form) throw new Error('missing form');
    const response = await fetch(formSubmit.url, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;
    if (!response.ok || payload?.ok === false) {
      throw new Error(payload?.error || `Could not send. Email ${contactMail.address} directly.`);
    }
  }, []);

  const deliver = useCallback(async () => {
    const env = envRef.current;
    if (!env) return;

    setError('');
    setStep(2, 'cur');

    if (motionScale() === 1) {
      bobRef.current = env.animate(
        [
          { transform: 'translateY(0) rotate(0deg)' },
          { transform: 'translateY(-10px) rotate(-1.5deg)' },
          { transform: 'translateY(-4px) rotate(1deg)' },
          { transform: 'translateY(0) rotate(0deg)' },
        ],
        { duration: 1100, iterations: Infinity, easing: 'ease-in-out' }
      );
    }

    try {
      await Promise.all([postMessage(), sleep(950)]);
    } catch (err) {
      bobRef.current?.cancel();
      bobRef.current = null;
      setStep(2, 'err');
      setPhase('error');
      setError(err instanceof Error ? err.message : `Could not send. Email ${contactMail.address} directly.`);
      if (motionScale() === 1) {
        void env.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-9px) rotate(-3deg)' },
            { transform: 'translateX(9px) rotate(3deg)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' },
          ],
          { duration: 420 }
        );
      }
      return;
    }

    bobRef.current?.cancel();
    bobRef.current = null;
    setStep(2, 'done');
    setStep(3, 'cur');
    await flyAway();

    cancelSceneAnims();
    resetSceneStyles();

    const first = payloadRef.current.name.trim().split(/\s+/)[0] || 'friend';
    setDoneName(first);
    setSteps(['done', 'done', 'done', 'done']);
    setPhase('done');
  }, [cancelSceneAnims, flyAway, postMessage, resetSceneStyles, setStep]);

  const validate = () => {
    const nameOk = formData.name.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const messageOk = formData.message.trim().length >= 5;
    const subjectOk = formData.subject.trim().length > 0;
    setFieldErrors({ name: !nameOk, email: !emailOk, message: !messageOk });
    if (!nameOk || !emailOk || !messageOk || !subjectOk) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPhase('packing');
    setSteps(['', '', '', '']);
    setError('');
    await sleep(420);
    await pack();
    await deliver();
  };

  const mailtoHref = `mailto:${contactMail.address}?subject=${encodeURIComponent(
    formData.subject || formSubmit.subject
  )}&body=${encodeURIComponent(
    `From: ${formData.name} <${formData.email}>\n\n${formData.message}`
  )}`;

  return (
    <div
      ref={rootRef}
      className={`contact-send${phase !== 'idle' ? ' contact-send--packing' : ''}${phase === 'done' ? ' contact-send--done' : ''}`}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        action={formSubmit.url}
        method="POST"
        className="contact-send__form studio-form"
        aria-hidden={phase !== 'idle'}
      >
        <input type="hidden" name="_subject" value={formSubmit.subject} />
        <input type="hidden" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="studio-form-row">
          <label className={`studio-field${fieldErrors.name ? ' contact-send__bad' : ''}`}>
            <span className="studio-field-label">Your name</span>
            <input
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="studio-input"
            />
            <span className="contact-send__field-msg">Tell me who’s writing.</span>
          </label>
          <label className={`studio-field${fieldErrors.email ? ' contact-send__bad' : ''}`}>
            <span className="studio-field-label">Email address</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="studio-input"
            />
            <span className="contact-send__field-msg">That email doesn’t look right.</span>
          </label>
        </div>

        <label className="studio-field">
          <span className="studio-field-label">Subject</span>
          <input
            name="subject"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="studio-input"
          />
        </label>

        <label className={`studio-field${fieldErrors.message ? ' contact-send__bad' : ''}`}>
          <span className="studio-field-label">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            maxLength={2000}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="studio-input studio-textarea"
          />
          <span className="contact-send__field-msg">Write at least a few words.</span>
        </label>

        <button
          type="submit"
          className={`hit-target studio-submit${shake ? ' contact-send__shake' : ''}`}
        >
          Send message
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </form>

      <div
        className="contact-send__stage"
        aria-hidden={phase === 'idle'}
        aria-live="polite"
      >
        {phase !== 'done' ? (
          <div className="contact-send__scene">
            <div className="contact-send__env" ref={envRef}>
              <div className="contact-send__eb" />
              <div className="contact-send__letter" ref={letterRef}>
                <div className="contact-send__pn contact-send__p1" ref={p1Ref} />
                <div className="contact-send__pn contact-send__p2" />
                <div className="contact-send__pn contact-send__p3" ref={p3Ref} />
              </div>
              <div className="contact-send__ef" />
              <div className="contact-send__fl" ref={flapRef} />
              <div className="contact-send__seal" ref={sealRef}>
                NK
              </div>
              <i className="contact-send__sp" aria-hidden />
              <i className="contact-send__sp" aria-hidden />
              <i className="contact-send__sp" aria-hidden />
              <div className="contact-send__wake" ref={wakeRef} aria-hidden>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-send__receipt" role="status">
            <svg viewBox="0 0 76 76" aria-hidden>
              <circle cx="38" cy="38" r="30" transform="rotate(-90 38 38)" />
              <path d="M25 39l9 9 18-19" />
            </svg>
            <h3>Message sent</h3>
            <p>Thanks, {doneName}. I&apos;ll reply within a day.</p>
          </div>
        )}

        <ul className="contact-send__steps">
          {STEPS.map((label, i) => (
            <li key={label} data-s={steps[i] || undefined}>
              <i aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <div className="contact-send__acts">
          {phase === 'error' ? (
            <>
              <p className="contact-send__acts-error" role="alert">
                {error}{' '}
                <a href={mailtoHref}>Open email draft</a>
              </p>
              <button type="button" className="contact-send__act contact-send__act--pri" onClick={() => void deliver()}>
                Try again
              </button>
              <button type="button" className="contact-send__act" onClick={resetToForm}>
                Edit message
              </button>
            </>
          ) : null}
          {phase === 'done' ? (
            <button
              type="button"
              className="contact-send__act contact-send__act--pri"
              onClick={() => {
                resetToForm();
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
            >
              Send another message
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
