export interface FilterFxBinding {
  refr: HTMLElement;
  host: HTMLElement;
  sourceId: string;
  scrollSync: boolean;
}

const bindings = new Set<FilterFxBinding>();
let syncRaf = 0;
let listenersReady = false;

export function resolveBackdropSourceId(el: HTMLElement): string {
  const explicit = el.dataset.lgSource;
  if (explicit) return explicit;
  if (el.dataset.glassMode === 'letter') return 'hero-lg-backdrop';
  return 'page-root';
}

export function needsScrollSync(sourceId: string): boolean {
  return sourceId === 'page-root';
}

export function syncFilterFxBinding(binding: FilterFxBinding) {
  const source = document.getElementById(binding.sourceId);
  if (!source) return;

  const sourceRect = source.getBoundingClientRect();
  const hostRect = binding.host.getBoundingClientRect();
  const { refr } = binding;

  refr.style.backgroundImage = `-moz-element(#${binding.sourceId})`;
  refr.style.backgroundSize = `${sourceRect.width}px ${sourceRect.height}px`;
  refr.style.backgroundPosition = `${sourceRect.left - hostRect.left}px ${sourceRect.top - hostRect.top}px`;
  refr.style.backgroundRepeat = 'no-repeat';
}

export function syncAllFilterFx() {
  bindings.forEach((binding) => syncFilterFxBinding(binding));
}

function scheduleFilterFxSync() {
  if (syncRaf) return;
  syncRaf = requestAnimationFrame(() => {
    syncRaf = 0;
    syncAllFilterFx();
  });
}

function ensureFilterFxListeners() {
  if (listenersReady || typeof window === 'undefined') return;
  listenersReady = true;
  window.addEventListener('scroll', scheduleFilterFxSync, { passive: true });
  window.addEventListener('resize', scheduleFilterFxSync);
}

export function registerFilterFx(binding: FilterFxBinding) {
  bindings.add(binding);
  ensureFilterFxListeners();
  syncFilterFxBinding(binding);
}

export function unregisterFilterFx(binding: FilterFxBinding) {
  bindings.delete(binding);
}
